'use client';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../button/button';
import { WorkflowNode } from './node/node';
import { ProcessingNode } from './processing-node/processing-node';
import { Junction } from './junction/junction';
import { FitViewHelper } from './workflow-inner';
import styles from './workflow.module.css';

export interface WorkflowInput {
  id: string;
  label: string;
  icon?: IconProp;
  enabled?: boolean;
}

export interface WorkflowOutput {
  id: string;
  label: string;
  icon?: IconProp;
  enabled?: boolean;
}

export interface WorkflowProcessingNode {
  id: string;
  label: string;
  variant?: 'customized' | 'add';
  icon?: IconProp;
  onClick?: () => void;
}

export interface WorkflowJunction {
  id: string;
  inputCount: number;
  outputCount: number;
}

export interface WorkflowConnection {
  from: string;
  to: string;
  fromSide?: 'left' | 'right';
  toSide?: 'left' | 'right';
  enabled?: boolean;
}

export interface WorkflowBuilderProps {
  title: string;
  inputs: WorkflowInput[];
  outputs: WorkflowOutput[];
  nodes?: WorkflowProcessingNode[];
  junctions?: WorkflowJunction[];
  connections: WorkflowConnection[];
  onInputToggle?: (id: string, enabled: boolean) => void;
  onOutputToggle?: (id: string, enabled: boolean) => void;
  onAddConnection?: (side: 'input' | 'output') => void;
  suggestionsCount?: number;
  onSuggestionsClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Custom node types
const InputNodeType = ({ data }: { data: any }) => {
  return (
    <div className={styles.reactFlowNode}>
      <Handle type="source" position={Position.Right} />
      <WorkflowNode
        id={data.id}
        label={data.label}
        icon={data.icon}
        enabled={data.enabled}
        onToggle={data.onToggle}
        variant="input"
      />
    </div>
  );
};

const OutputNodeType = ({ data }: { data: any }) => {
  return (
    <div className={styles.reactFlowNode}>
      <Handle type="target" position={Position.Left} />
      <WorkflowNode
        id={data.id}
        label={data.label}
        icon={data.icon}
        enabled={data.enabled}
        onToggle={data.onToggle}
        variant="output"
      />
    </div>
  );
};

const ProcessingNodeType = ({ data }: { data: any }) => {
  return (
    <div className={styles.reactFlowNode}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <ProcessingNode
        id={data.id}
        label={data.label}
        variant={data.variant}
        icon={data.icon}
        onClick={data.onClick}
      />
    </div>
  );
};

const JunctionNodeType = ({ data }: { data: any }) => {
  return (
    <div className={styles.reactFlowNode}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Junction
        id={data.id}
        inputCount={data.inputCount}
        outputCount={data.outputCount}
      />
    </div>
  );
};

const nodeTypes = {
  input: InputNodeType,
  output: OutputNodeType,
  processing: ProcessingNodeType,
  junction: JunctionNodeType,
};

function WorkflowBuilderInner({
  title,
  inputs,
  outputs,
  nodes = [],
  junctions = [],
  connections,
  onInputToggle,
  onOutputToggle,
  onAddConnection,
  suggestionsCount,
  onSuggestionsClick,
  className,
  style
}: WorkflowBuilderProps) {
  // Convert inputs to React Flow nodes - positioned on the left
  const inputNodes = useMemo(() => {
    return inputs.map((input, index) => ({
      id: input.id,
      type: 'input' as const,
      position: { x: 0, y: index * 80 },
      data: {
        id: input.id,
        label: input.label,
        icon: input.icon,
        enabled: input.enabled ?? false,
        onToggle: (enabled: boolean) => {
          onInputToggle?.(input.id, enabled);
        },
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [inputs, onInputToggle]);

  // Convert outputs to React Flow nodes - positioned on the right
  const outputNodes = useMemo(() => {
    return outputs.map((output, index) => ({
      id: output.id,
      type: 'output' as const,
      position: { x: 800, y: index * 80 },
      data: {
        id: output.id,
        label: output.label,
        icon: output.icon,
        enabled: output.enabled ?? false,
        onToggle: (enabled: boolean) => {
          onOutputToggle?.(output.id, enabled);
        },
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [outputs, onOutputToggle]);

  // Convert processing nodes to React Flow nodes - positioned in the middle
  const processingNodes = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      type: 'processing' as const,
      position: { x: 350, y: index * 60 + 50 },
      data: {
        id: node.id,
        label: node.label,
        variant: node.variant,
        icon: node.icon,
        onClick: node.onClick,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [nodes]);

  // Get enabled states from nodes
  const enabledStates = useMemo(() => {
    const states = new Map<string, boolean>();
    inputNodes.forEach(node => states.set(node.id, node.data.enabled));
    outputNodes.forEach(node => states.set(node.id, node.data.enabled));
    return states;
  }, [inputNodes, outputNodes]);

  // Generate connections automatically: active inputs → junctions → active outputs
  const autoConnections = useMemo(() => {
    const auto: WorkflowConnection[] = [];
    
    junctions.forEach(junction => {
      // Connect all active inputs to this junction
      inputs.forEach(input => {
        if (input.enabled) {
          auto.push({
            from: input.id,
            to: junction.id,
            fromSide: 'right',
            toSide: 'left',
            enabled: true,
          });
        }
      });
      
      // Connect junction to all active outputs
      outputs.forEach(output => {
        if (output.enabled) {
          auto.push({
            from: junction.id,
            to: output.id,
            fromSide: 'right',
            toSide: 'left',
            enabled: true,
          });
        }
      });
    });
    
    return auto;
  }, [inputs, outputs, junctions]);

  // Merge manual connections with auto-generated ones
  const allConnections = useMemo(() => {
    // If there are junctions, use auto-connections; otherwise use manual connections
    if (junctions.length > 0) {
      return autoConnections;
    }
    return connections;
  }, [junctions.length, autoConnections, connections]);

  // Calculate junction counts based on active connections
  const junctionCounts = useMemo(() => {
    const counts = new Map<string, { inputCount: number; outputCount: number }>();
    
    junctions.forEach(junction => {
      // Count active inputs connecting to this junction
      const inputCount = allConnections.filter(conn => {
        if (conn.to !== junction.id) return false;
        const sourceEnabled = enabledStates.get(conn.from) ?? true;
        return conn.enabled !== false && sourceEnabled;
      }).length;
      
      // Count active outputs connecting from this junction
      const outputCount = allConnections.filter(conn => {
        if (conn.from !== junction.id) return false;
        const targetEnabled = enabledStates.get(conn.to) ?? true;
        return conn.enabled !== false && targetEnabled;
      }).length;
      
      counts.set(junction.id, { inputCount, outputCount });
    });
    
    return counts;
  }, [junctions, allConnections, enabledStates]);

  // Convert junctions to React Flow nodes with updated counts
  const junctionNodes = useMemo(() => {
    return junctions.map((junction, index) => {
      const counts = junctionCounts.get(junction.id) || { inputCount: 0, outputCount: 0 };
      return {
        id: junction.id,
        type: 'junction' as const,
        position: { x: 350, y: (nodes.length * 60 + 50) + (index * 60) },
        data: {
          id: junction.id,
          inputCount: counts.inputCount,
          outputCount: counts.outputCount,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [junctions, nodes.length, junctionCounts]);

  // Combine all nodes
  const initialNodes = useMemo(() => {
    return [...inputNodes, ...outputNodes, ...processingNodes, ...junctionNodes];
  }, [inputNodes, outputNodes, processingNodes, junctionNodes]);

  // Get all node IDs for validation
  const allNodeIds = useMemo(() => {
    return new Set([
      ...inputNodes.map(n => n.id),
      ...outputNodes.map(n => n.id),
      ...processingNodes.map(n => n.id),
      ...junctionNodes.map(n => n.id),
    ]);
  }, [inputNodes, outputNodes, processingNodes, junctionNodes]);

  // Convert connections to React Flow edges
  const initialEdges = useMemo(() => {
    const edges = allConnections
      .filter(conn => {
        // Only create edges if both source and target nodes exist
        return allNodeIds.has(conn.from) && allNodeIds.has(conn.to);
      })
      .map((conn, index) => {
        const sourceEnabled = enabledStates.get(conn.from) ?? true;
        const targetEnabled = enabledStates.get(conn.to) ?? true;
        const enabled = conn.enabled !== false && sourceEnabled && targetEnabled;

        return {
          id: `edge-${conn.from}-${conn.to}-${index}`,
          source: conn.from,
          target: conn.to,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: enabled ? '#0084ff' : '#cbd5e1',
            strokeWidth: enabled ? 2 : 1,
            strokeDasharray: enabled ? undefined : '4 2',
            opacity: enabled ? 0.8 : 0.4,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: enabled ? '#0084ff' : '#cbd5e1',
            width: 20,
            height: 20,
          },
        };
      });
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating edges:', edges.length, edges);
      console.log('Node IDs:', Array.from(allNodeIds));
      console.log('Connections:', allConnections);
    }
    
    return edges;
  }, [allConnections, enabledStates, allNodeIds]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(
    initialNodes as Node[]
  );
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const fitViewTriggered = useRef(false);

  // Update nodes when inputs/outputs change, preserving positions
  useEffect(() => {
    setNodes((currentNodes) => {
      // Create a map of existing node positions
      const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
      
      // Create updated nodes with preserved positions
      const updatedNodes = [...inputNodes, ...outputNodes, ...processingNodes, ...junctionNodes].map(newNode => {
        const existingPosition = positionMap.get(newNode.id);
        return {
          ...newNode,
          position: existingPosition || newNode.position,
        };
      });
      
      return updatedNodes as Node[];
    });
    fitViewTriggered.current = false;
  }, [inputNodes, outputNodes, processingNodes, junctionNodes, setNodes]);

  // Update edges when connections change
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <div
      className={`${styles.workflow} ${className || ''}`}
      style={style}
      data-workflow-container
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {suggestionsCount !== undefined && onSuggestionsClick && (
          <Button
            text={`${suggestionsCount} Suggestions`}
            onClick={onSuggestionsClick}
            size="small"
            color="secondary"
            subColor="tonal"
          />
        )}
      </div>

      <div className={styles.reactFlowContainer}>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          attributionPosition="bottom-right"
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <FitViewHelper />
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {onAddConnection && (
        <div className={styles.addConnectionButtons}>
          <Button
            text="+ Add Connection"
            onClick={() => onAddConnection('input')}
            size="small"
            subColor="outline"
          />
          <Button
            text="+ Add Connection"
            onClick={() => onAddConnection('output')}
            size="small"
            subColor="outline"
          />
        </div>
      )}
    </div>
  );
}

export function WorkflowBuilder(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner {...props} />
    </ReactFlowProvider>
  );
}
