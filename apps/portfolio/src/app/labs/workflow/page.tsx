'use client';
import { useState, useCallback, useMemo } from 'react';
import { Container, WorkflowBuilder, Button } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';
import type { 
  WorkflowInput, 
  WorkflowOutput, 
  WorkflowProcessingNode,
  WorkflowJunction,
  WorkflowConnection 
} from '@skyforge/ui';
import { 
  faInfoCircle, 
  faArrowLeft, 
  faCircle,
  faCheck,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
    ],
    outputs: [
      { id: 'output1', label: 'Output X', icon: faCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Output Y', icon: faCircle as IconProp, enabled: false },
    ],
    nodes: [
      { id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp },
    ],
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
    ],
    outputs: [
      { id: 'output1', label: 'Destination 1', icon: faCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Destination 2', icon: faCircle as IconProp, enabled: true },
    ],
    nodes: [
      { id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp },
      { id: 'node2', label: '+ Customize', variant: 'add', icon: faPlus as IconProp },
    ],
    junctions: [
      { id: 'junction1', inputCount: 2, outputCount: 2 },
    ],
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
    ],
    outputs: [
      { id: 'output1', label: 'ISAAC', icon: faInfoCircle as IconProp, enabled: true },
      { id: 'output2', label: 'Platform Sci...', icon: faArrowLeft as IconProp, enabled: true },
      { id: 'output3', label: 'Mcleod', icon: faCircle as IconProp, enabled: false },
    ],
    nodes: [
      { id: 'node1', label: 'Customized', variant: 'customized', icon: faCheck as IconProp },
      { id: 'node2', label: '+ Customize', variant: 'add', icon: faPlus as IconProp },
    ],
    junctions: [
      { id: 'junction1', inputCount: 2, outputCount: 2 },
    ],
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
  const [suggestionsCount] = useState(12);

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
    setInputs(prev => prev.map(input => 
      input.id === id ? { ...input, enabled } : input
    ));
  }, []);

  const handleOutputToggle = useCallback((id: string, enabled: boolean) => {
    setOutputs(prev => prev.map(output => 
      output.id === id ? { ...output, enabled } : output
    ));
  }, []);

  const handleAddConnection = useCallback((side: 'input' | 'output') => {
    if (side === 'input') {
      const newId = `input${inputs.length + 1}`;
      setInputs(prev => [...prev, {
        id: newId,
        label: `New Input ${inputs.length + 1}`,
        icon: faInfoCircle as IconProp,
        enabled: false,
      }]);
    } else {
      const newId = `output${outputs.length + 1}`;
      setOutputs(prev => [...prev, {
        id: newId,
        label: `New Output ${outputs.length + 1}`,
        icon: faCircle as IconProp,
        enabled: false,
      }]);
    }
  }, [inputs.length, outputs.length]);

  const handleSuggestionsClick = useCallback(() => {
    alert(`Showing ${suggestionsCount} connection suggestions!`);
  }, [suggestionsCount]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, variant: node.variant === 'customized' ? 'add' : 'customized', icon: node.variant === 'customized' ? faPlus as IconProp : faCheck as IconProp }
        : node
    ));
  }, []);

  const configuredNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      onClick: () => handleNodeClick(node.id),
    }));
  }, [nodes, handleNodeClick]);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Container size="large" padding="lg" glass={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Workflow Builder
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-on-surface-alt)',
              lineHeight: 1.6,
              maxWidth: '800px',
              marginBottom: '1.5rem'
            }}>
              Interactive workflow builder with configurable connections. Toggle inputs and outputs to see connections update in real-time.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  text={preset.name}
                  onClick={() => loadPreset(index)}
                  size="small"
                  color={selectedPreset === index ? 'primary' : 'secondary'}
                  subColor={selectedPreset === index ? 'filled' : 'outline'}
                />
              ))}
            </div>
          </div>

          <WorkflowBuilder
            title="Workflow"
            inputs={inputs}
            outputs={outputs}
            nodes={configuredNodes}
            junctions={junctions}
            connections={connections}
            onInputToggle={handleInputToggle}
            onOutputToggle={handleOutputToggle}
            onAddConnection={handleAddConnection}
            suggestionsCount={suggestionsCount}
            onSuggestionsClick={handleSuggestionsClick}
            style={{
              minHeight: '500px',
              width: '100%'
            }}
          />
        </div>
      </Container>
    </div>
  );
}

