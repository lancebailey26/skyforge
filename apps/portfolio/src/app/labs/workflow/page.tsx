'use client';

import { useState, useCallback, useMemo } from 'react';
import { WorkflowBuilder, Button } from '@lancebailey26/skyforge-ui';
import { useTitle } from '@/hooks/useTitle';
import { LabPageChrome } from '@/components/labs/LabPageChrome';
import { metadata } from './metadata';
import type {
  WorkflowInput,
  WorkflowOutput,
  WorkflowProcessingNode,
  WorkflowJunction,
  WorkflowConnection,
} from '@lancebailey26/skyforge-ui';
import {
  faInfoCircle,
  faArrowLeft,
  faCircle,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type PresetConfig = {
  name: string;
  inputs: WorkflowInput[];
  outputs: WorkflowOutput[];
  nodes: WorkflowProcessingNode[];
  junctions: WorkflowJunction[];
  connections: WorkflowConnection[];
};

const presets: PresetConfig[] = [
  {
    name: 'Simple Flow',
    inputs: [
      { id: 'input1', label: 'Input A', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'input2', label: 'Input B', icon: faInfoCircle as IconProp, enabled: false },
    ] as WorkflowInput[],
    outputs: [
      { id: 'output1', label: 'Output X', icon: faCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Output Y', icon: faCircle as IconProp, enabled: false },
    ],
    nodes: [{ id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp }],
    junctions: [],
    connections: [
      { from: 'input1', to: 'node1', fromSide: 'right', toSide: 'left' },
      { from: 'node1', to: 'output1', fromSide: 'right', toSide: 'left' },
    ],
  },
  {
    name: 'Parallel Processing',
    inputs: [
      { id: 'input1', label: 'Source 1', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'input2', label: 'Source 2', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'input3', label: 'Source 3', icon: faInfoCircle as IconProp, enabled: false },
    ] as WorkflowInput[],
    outputs: [
      { id: 'output1', label: 'Destination 1', icon: faCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Destination 2', icon: faCircle as IconProp, enabled: true },
    ],
    nodes: [
      { id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp },
      { id: 'node2', label: '+ Customize', variant: 'add', icon: faPlus as IconProp },
    ],
    junctions: [{ id: 'junction1', inputCount: 2, outputCount: 2 }],
    connections: [
      { from: 'input1', to: 'node1', fromSide: 'right', toSide: 'left' },
      { from: 'input2', to: 'node2', fromSide: 'right', toSide: 'left' },
      { from: 'node1', to: 'junction1', fromSide: 'right', toSide: 'left' },
      { from: 'node2', to: 'junction1', fromSide: 'right', toSide: 'left' },
      { from: 'junction1', to: 'output1', fromSide: 'right', toSide: 'left' },
      { from: 'junction1', to: 'output2', fromSide: 'right', toSide: 'left' },
    ],
  },
  {
    name: 'Complex Workflow',
    inputs: [
      { id: 'input1', label: 'ISAAC', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'input2', label: 'Platform Sci...', icon: faArrowLeft as IconProp, enabled: false },
      { id: 'input3', label: 'Mcleod', icon: faCircle as IconProp, enabled: true },
    ] as WorkflowInput[],
    outputs: [
      { id: 'output1', label: 'ISAAC', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Platform Sci...', icon: faArrowLeft as IconProp, enabled: true },
      { id: 'output3', label: 'Mcleod', icon: faCircle as IconProp, enabled: false },
    ],
    nodes: [
      { id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp },
      { id: 'node2', label: '+ Customize', variant: 'add', icon: faPlus as IconProp },
    ],
    junctions: [{ id: 'junction1', inputCount: 2, outputCount: 2 }],
    connections: [
      { from: 'input1', to: 'node1', fromSide: 'right', toSide: 'left' },
      { from: 'input3', to: 'node2', fromSide: 'right', toSide: 'left' },
      { from: 'node1', to: 'junction1', fromSide: 'right', toSide: 'left' },
      { from: 'node2', to: 'junction1', fromSide: 'right', toSide: 'left' },
      { from: 'junction1', to: 'output1', fromSide: 'right', toSide: 'left' },
      { from: 'junction1', to: 'output2', fromSide: 'right', toSide: 'left' },
    ],
  },
];

export default function WorkflowPage() {
  useTitle('Workflow Builder - Labs');

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [inputs, setInputs] = useState<WorkflowInput[]>(presets[0].inputs);
  const [outputs, setOutputs] = useState<WorkflowOutput[]>(presets[0].outputs);
  const [nodes, setNodes] = useState<WorkflowProcessingNode[]>(presets[0].nodes);
  const [junctions, setJunctions] = useState<WorkflowJunction[]>(presets[0].junctions);
  const [connections, setConnections] = useState<WorkflowConnection[]>(presets[0].connections);
  const suggestionsCount = 12;

  const loadPreset = useCallback((index: number) => {
    const preset = presets[index];
    setInputs([...preset.inputs]);
    setOutputs([...preset.outputs]);
    setNodes([...preset.nodes]);
    setJunctions([...preset.junctions]);
    setConnections([...preset.connections]);
    setSelectedPreset(index);
  }, []);

  const handleInputToggle = useCallback((id: string, enabled: boolean) => {
    setInputs((prev) => prev.map((input) => (input.id === id ? { ...input, enabled } : input)));
  }, []);

  const handleOutputToggle = useCallback((id: string, enabled: boolean) => {
    setOutputs((prev) => prev.map((output) => (output.id === id ? { ...output, enabled } : output)));
  }, []);

  const handleAddConnection = useCallback(
    (side: 'input' | 'output') => {
      if(side === 'input') {
        const newId = `input${inputs.length + 1}`;
        setInputs((prev) => [
          ...prev,
          {
            id: newId,
            label: `New Input ${inputs.length + 1}`,
            icon: faInfoCircle as IconProp,
            enabled: false,
          } as WorkflowInput,
        ]);
      } else {
        const newId = `output${outputs.length + 1}`;
        setOutputs((prev) => [
          ...prev,
          {
            id: newId,
            label: `New Output ${outputs.length + 1}`,
            icon: faCircle as IconProp,
            enabled: false,
          },
        ]);
      }
    },
    [inputs.length, outputs.length]
  );

  const handleSuggestionsClick = useCallback(() => {
    alert(`Showing ${suggestionsCount} connection suggestions!`);
  }, [suggestionsCount]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ?
          {
            ...node,
            variant: node.variant === 'customized' ? 'add' : 'customized',
            icon: node.variant === 'customized' ? (faPlus as IconProp) : (faCheck as IconProp),
          } :
          node
      )
    );
  }, []);

  const handleNodeLabelChange = useCallback((nodeId: string, label: string) => {
    const trimmed = label.trim();
    if(!trimmed) {
      return;
    }
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, label: trimmed } : node))
    );
  }, []);

  const handleWorkflowConnect = useCallback((from: string, to: string) => {
    setConnections((prev) => {
      if(prev.some((c) => c.from === from && c.to === to)) {
        return prev;
      }
      return [...prev, { from, to, fromSide: 'right', toSide: 'left' }];
    });
  }, []);

  const configuredNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      onClick: () => handleNodeClick(node.id),
      onLabelChange: (label: string) => handleNodeLabelChange(node.id, label),
    }));
  }, [nodes, handleNodeClick, handleNodeLabelChange]);

  return (
    <LabPageChrome title={metadata.title} subtitle={metadata.description}>
      <div className="lab-preset-row">
        {presets.map((preset, index) => (
          <Button
            key={preset.name}
            text={preset.name}
            onClick={() => loadPreset(index)}
            size="small"
            color={selectedPreset === index ? 'primary' : 'secondary'}
            subColor={selectedPreset === index ? 'filled' : 'outline'}
          />
        ))}
      </div>

      <div className="tech-marquee-stage lab-workflow-canvas-wrap">
        <p className="tech-marquee-stage-kicker">Canvas</p>
        <WorkflowBuilder
          title="Workflow"
          inputs={inputs}
          outputs={outputs}
          nodes={configuredNodes}
          junctions={junctions}
          connections={connections}
          onInputToggle={handleInputToggle}
          onOutputToggle={handleOutputToggle}
          onWorkflowConnect={handleWorkflowConnect}
          onAddConnection={handleAddConnection}
          suggestionsCount={suggestionsCount}
          onSuggestionsClick={handleSuggestionsClick}
          style={{
            minHeight: 'min(520px, 65vh)',
            width: '100%',
          }}
        />
      </div>
    </LabPageChrome>
  );
}