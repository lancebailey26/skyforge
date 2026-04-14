'use client';
import { useMemo, useCallback, useEffect } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeProps,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionMode,
  MarkerType,
  ReactFlowProvider,
  Handle,
  Position,
  NodeResizer,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { Button } from '../button/button';
import { WorkflowNode } from './node/node';
import { ProcessingNode } from './processing-node/processing-node';
import { Junction } from './junction/junction';
import { FitViewHelper } from './workflow-inner';
import styles from './workflow.module.css';

export interface WorkflowInput {
  onToggle: (enabled: boolean) => void;
  id: string;
  label: string;
  icon?: IconProp;
  enabled?: boolean;
  /** Passed to {@link WorkflowNode} as DOM `id` on the root element. */
  rootId?: string;
}

export interface WorkflowOutput {
  id: string;
  label: string;
  icon?: IconProp;
  enabled?: boolean;
  rootId?: string;
}

export interface WorkflowProcessingNode {
  id: string;
  label: string;
  variant?: 'customized' | 'add';
  icon?: IconProp;
  onClick?: () => void;
  /** When set, double-click the label to rename (builder injects this for editable labs). */
  onLabelChange?: (label: string) => void;
  rootId?: string;
}

export interface WorkflowJunction {
  id: string;
  inputCount: number;
  outputCount: number;
  rootId?: string;
}

export interface WorkflowConnection {
  from: string;
  to: string;
  fromSide?: 'left' | 'right';
  toSide?: 'left' | 'right';
  enabled?: boolean;
}

type WorkflowOutputNodeData = WorkflowOutput & {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export interface WorkflowBuilderProps {
  title: string;
  inputs: WorkflowInput[];
  outputs: WorkflowOutput[];
  nodes?: WorkflowProcessingNode[];
  junctions?: WorkflowJunction[];
  connections: WorkflowConnection[];
  onInputToggle?: (id: string, enabled: boolean) => void;
  onOutputToggle?: (id: string, enabled: boolean) => void;
  /** Called when the user connects two nodes on the canvas (source must have a source handle, target a target handle). */
  onWorkflowConnect?: (from: string, to: string) => void;
  onAddConnection?: (side: 'input' | 'output') => void;
  suggestionsCount?: number;
  onSuggestionsClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const NODE_RESIZE_MIN = { w: 140, h: 40 } as const;
const DEFAULT_IO_STYLE = { width: 260, minHeight: NODE_RESIZE_MIN.h } as const;
const DEFAULT_PROCESSING_STYLE = { width: 220, minHeight: NODE_RESIZE_MIN.h } as const;
const DEFAULT_JUNCTION_STYLE = { width: 140, minHeight: 56 } as const;

const EMPTY_EDGE_TYPES = {} as EdgeTypes;

/** Stable defaults — `= []` in parameters creates a new array each render when the prop is omitted, retriggers sync effects, and can hit max update depth (React #185). */
const EMPTY_WORKFLOW_NODES: WorkflowProcessingNode[] = [];
const EMPTY_WORKFLOW_JUNCTIONS: WorkflowJunction[] = [];

const InputNodeType = ({ data }: NodeProps<WorkflowInput>) => {
  return (
    <>
      <NodeResizer
        isVisible
        minWidth={NODE_RESIZE_MIN.w}
        minHeight={NODE_RESIZE_MIN.h}
        lineClassName="nodrag"
        handleClassName="nodrag"
      />
      <div className={styles.reactFlowNode}>
        <Handle id="out" type="source" position={Position.Right} />
        <WorkflowNode
          id={data.id}
          label={data.label}
          icon={data.icon}
          enabled={data.enabled ?? false}
          onToggle={data.onToggle}
          variant="input"
          rootId={data.rootId}
        />
      </div>
    </>
  );
};

const OutputNodeType = ({ data }: NodeProps<WorkflowOutputNodeData>) => {
  return (
    <>
      <NodeResizer
        isVisible
        minWidth={NODE_RESIZE_MIN.w}
        minHeight={NODE_RESIZE_MIN.h}
        lineClassName="nodrag"
        handleClassName="nodrag"
      />
      <div className={styles.reactFlowNode}>
        <Handle id="in" type="target" position={Position.Left} />
        <WorkflowNode
          id={data.id}
          label={data.label}
          icon={data.icon}
          enabled={data.enabled}
          onToggle={data.onToggle}
          variant="output"
          rootId={data.rootId}
        />
      </div>
    </>
  );
};

const ProcessingNodeType = ({ data }: NodeProps<WorkflowProcessingNode>) => {
  return (
    <>
      <NodeResizer
        isVisible
        minWidth={NODE_RESIZE_MIN.w}
        minHeight={NODE_RESIZE_MIN.h}
        lineClassName="nodrag"
        handleClassName="nodrag"
      />
      <div className={styles.reactFlowNode}>
        <Handle id="in" type="target" position={Position.Left} />
        <Handle id="out" type="source" position={Position.Right} />
        <ProcessingNode
          id={data.id}
          label={data.label}
          variant={data.variant}
          icon={data.icon}
          onClick={data.onClick}
          onLabelChange={data.onLabelChange}
          rootId={data.rootId}
        />
      </div>
    </>
  );
};

const JunctionNodeType = ({ data }: NodeProps<WorkflowJunction>) => {
  return (
    <>
      <NodeResizer
        isVisible
        minWidth={NODE_RESIZE_MIN.w}
        minHeight={NODE_RESIZE_MIN.h}
        lineClassName="nodrag"
        handleClassName="nodrag"
      />
      <div className={styles.reactFlowNode}>
        <Handle id="in" type="target" position={Position.Left} />
        <Handle id="out" type="source" position={Position.Right} />
        <Junction
          id={data.id}
          inputCount={data.inputCount}
          outputCount={data.outputCount}
          rootId={data.rootId}
        />
      </div>
    </>
  );
};

function WorkflowBuilderInner({
  title,
  inputs,
  outputs,
  nodes = EMPTY_WORKFLOW_NODES,
  junctions = EMPTY_WORKFLOW_JUNCTIONS,
  connections,
  onInputToggle,
  onOutputToggle,
  onWorkflowConnect,
  onAddConnection,
  suggestionsCount,
  onSuggestionsClick,
  className,
  style,
  id,
}: WorkflowBuilderProps) {
  const flowNodeTypes = useMemo<NodeTypes>(
    () => ({
      input: InputNodeType,
      output: OutputNodeType,
      processing: ProcessingNodeType,
      junction: JunctionNodeType,
    }),
    []
  );

  const inputNodes = useMemo(() => {
    return inputs.map((input, index) => ({
      id: input.id,
      type: 'input' as const,
      position: { x: 0, y: index * 80 },
      style: { ...DEFAULT_IO_STYLE },
      data: {
        id: input.id,
        label: input.label,
        icon: input.icon,
        enabled: input.enabled ?? false,
        rootId: input.rootId,
        onToggle: (enabled: boolean) => {
          onInputToggle?.(input.id, enabled);
        },
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [inputs, onInputToggle]);

  const outputNodes = useMemo(() => {
    return outputs.map((output, index) => ({
      id: output.id,
      type: 'output' as const,
      position: { x: 800, y: index * 80 },
      style: { ...DEFAULT_IO_STYLE },
      data: {
        id: output.id,
        label: output.label,
        icon: output.icon,
        enabled: output.enabled ?? false,
        rootId: output.rootId,
        onToggle: (enabled: boolean) => {
          onOutputToggle?.(output.id, enabled);
        },
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [outputs, onOutputToggle]);

  const processingNodes = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      type: 'processing' as const,
      position: { x: 350, y: index * 60 + 50 },
      style: { ...DEFAULT_PROCESSING_STYLE },
      data: {
        id: node.id,
        label: node.label,
        variant: node.variant,
        icon: node.icon,
        onClick: node.onClick,
        onLabelChange: node.onLabelChange,
        rootId: node.rootId,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [nodes]);

  const enabledStates = useMemo(() => {
    const states = new Map<string, boolean>();
    inputNodes.forEach(node => states.set(node.id, node.data.enabled));
    outputNodes.forEach(node => states.set(node.id, node.data.enabled));
    return states;
  }, [inputNodes, outputNodes]);

  const autoConnections = useMemo(() => {
    const auto: WorkflowConnection[] = [];

    junctions.forEach(junction => {
      inputs.forEach(input => {
        if(input.enabled) {
          auto.push({
            from: input.id,
            to: junction.id,
            fromSide: 'right',
            toSide: 'left',
            enabled: true,
          });
        }
      });

      outputs.forEach(output => {
        if(output.enabled) {
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

  const allConnections = useMemo(() => {
    if(connections.length > 0) {
      return connections;
    }
    if(junctions.length > 0) {
      return autoConnections;
    }
    return connections;
  }, [connections, junctions.length, autoConnections]);

  const junctionCounts = useMemo(() => {
    const counts = new Map<string, { inputCount: number; outputCount: number }>();

    junctions.forEach(junction => {
      const inputCount = allConnections.filter(conn => {
        if(conn.to !== junction.id)return false;
        const sourceEnabled = enabledStates.get(conn.from) ?? true;
        return conn.enabled !== false && sourceEnabled;
      }).length;

      const outputCount = allConnections.filter(conn => {
        if(conn.from !== junction.id)return false;
        const targetEnabled = enabledStates.get(conn.to) ?? true;
        return conn.enabled !== false && targetEnabled;
      }).length;

      counts.set(junction.id, { inputCount, outputCount });
    });

    return counts;
  }, [junctions, allConnections, enabledStates]);

  const junctionNodes = useMemo(() => {
    return junctions.map((junction, index) => {
      const counts = junctionCounts.get(junction.id) || { inputCount: 0, outputCount: 0 };
      return {
        id: junction.id,
        type: 'junction' as const,
        position: { x: 350, y: (nodes.length * 60 + 50) + (index * 60) },
        style: { ...DEFAULT_JUNCTION_STYLE },
        data: {
          id: junction.id,
          inputCount: counts.inputCount,
          outputCount: counts.outputCount,
          rootId: junction.rootId,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [junctions, nodes.length, junctionCounts]);

  const initialNodes = useMemo(() => {
    return [...inputNodes, ...outputNodes, ...processingNodes, ...junctionNodes];
  }, [inputNodes, outputNodes, processingNodes, junctionNodes]);

  const allNodeIds = useMemo(() => {
    return new Set([
      ...inputNodes.map(n => n.id),
      ...outputNodes.map(n => n.id),
      ...processingNodes.map(n => n.id),
      ...junctionNodes.map(n => n.id),
    ]);
  }, [inputNodes, outputNodes, processingNodes, junctionNodes]);

  const initialEdges = useMemo(() => {
    const edges = allConnections
      .filter(conn => allNodeIds.has(conn.from) && allNodeIds.has(conn.to))
      .map((conn, index) => {
        const sourceEnabled = enabledStates.get(conn.from) ?? true;
        const targetEnabled = enabledStates.get(conn.to) ?? true;
        const enabled = conn.enabled !== false && sourceEnabled && targetEnabled;

        return {
          id: `edge-${conn.from}-${conn.to}-${index}`,
          source: conn.from,
          target: conn.to,
          sourceHandle: 'out',
          targetHandle: 'in',
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

    return edges;
  }, [allConnections, enabledStates, allNodeIds]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(
    initialNodes as Node[]
  );
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((currentNodes) => {
      const byId = new Map(currentNodes.map((node) => [node.id, node]));
      const nextBlueprint = [...inputNodes, ...outputNodes, ...processingNodes, ...junctionNodes] as Node[];

      const updatedNodes = nextBlueprint.map((newNode) => {
        const cur = byId.get(newNode.id);
        const position = cur?.position ?? newNode.position;
        return {
          ...newNode,
          position,
          width: cur?.width ?? newNode.width,
          height: cur?.height ?? newNode.height,
          style: { ...(newNode.style ?? {}), ...(cur?.style ?? {}) },
        };
      });

      return updatedNodes as Node[];
    });
  }, [inputNodes, outputNodes, processingNodes, junctionNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if(!source || !target || source === target) {
        return false;
      }
      const sourceNode = reactFlowNodes.find((n) => n.id === source);
      const targetNode = reactFlowNodes.find((n) => n.id === target);
      if(!sourceNode || !targetNode) {
        return false;
      }
      const sourceCanEmit =
        sourceNode.type === 'input' ||
        sourceNode.type === 'processing' ||
        sourceNode.type === 'junction';
      const targetCanReceive =
        targetNode.type === 'output' ||
        targetNode.type === 'processing' ||
        targetNode.type === 'junction';
      if(!sourceCanEmit || !targetCanReceive) {
        return false;
      }
      const duplicate = allConnections.some(
        (c) => c.from === source && c.to === target
      );
      if(duplicate) {
        return false;
      }
      return true;
    },
    [reactFlowNodes, allConnections]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if(!params.source || !params.target) {
        return;
      }
      const next = {
        ...params,
        sourceHandle: params.sourceHandle ?? 'out',
        targetHandle: params.targetHandle ?? 'in',
      };
      setEdges((eds) =>
        addEdge(
          {
            ...next,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#0084ff',
              width: 20,
              height: 20,
            },
          },
          eds
        )
      );
      onWorkflowConnect?.(params.source, params.target);
    },
    [setEdges, onWorkflowConnect]
  );

  return (
    <div
      id={id}
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
          isValidConnection={isValidConnection}
          nodeTypes={flowNodeTypes}
          edgeTypes={EMPTY_EDGE_TYPES}
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