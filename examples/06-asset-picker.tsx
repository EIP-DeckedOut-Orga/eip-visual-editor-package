/**
 * Example 6: Asset Picker Integration
 * 
 * This example shows how to integrate an asset picker for managing
 * and inserting images, icons, or other media into the editor.
 */

import React, { useState, useCallback } from 'react';
import { 
  VisualEditorWorkspace, 
  EditorMode,
  AssetPickerProps,
  createElement
} from '@deckedout/visual-editor';

// Mock asset data
const mockAssets = [
  {
    name: 'Character 1',
    path: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=Char1',
    type: 'character'
  },
  {
    name: 'Character 2',
    path: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=Char2',
    type: 'character'
  },
  {
    name: 'Background 1',
    path: 'https://via.placeholder.com/300x200/95e1d3/ffffff?text=BG1',
    type: 'background'
  },
  {
    name: 'Background 2',
    path: 'https://via.placeholder.com/300x200/f38181/ffffff?text=BG2',
    type: 'background'
  },
  {
    name: 'Icon 1',
    path: 'https://via.placeholder.com/100/aa96da/ffffff?text=Icon1',
    type: 'icon'
  },
  {
    name: 'Icon 2',
    path: 'https://via.placeholder.com/100/fcbad3/ffffff?text=Icon2',
    type: 'icon'
  },
  {
    name: 'Prop 1',
    path: 'https://via.placeholder.com/120/ffffd2/333333?text=Prop1',
    type: 'prop'
  },
  {
    name: 'Prop 2',
    path: 'https://via.placeholder.com/120/a8e6cf/333333?text=Prop2',
    type: 'prop'
  }
];

export function AssetPickerExample() {
  const [assets] = useState(mockAssets);

  // Editor mode with asset picker
  const gameEditorMode: EditorMode = {
    id: 'game-editor',
    name: 'Game Asset Editor',
    description: 'Design game scenes with asset picker',
    
    canvasSize: {
      width: 1200,
      height: 800
    },
    
    // Configure asset picker
    assetPickerConfig: {
      title: 'Game Assets',
      // Assets are passed via prop
    }
  };

  // Handle asset selection
  const handleAssetSelect = useCallback((assetPath: string) => {
    console.log('Asset selected:', assetPath);
    // The editor will automatically create an image element
    // You can also handle this manually using the API
  }, []);

  // Custom asset renderer (optional)
  const renderAsset = useCallback((asset: typeof mockAssets[0]) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="asset-item"
      >
        <img
          src={asset.path}
          alt={asset.name}
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
            marginBottom: '8px',
            borderRadius: '4px'
          }}
        />
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '80px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {asset.name}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#64748b',
          textTransform: 'capitalize'
        }}>
          {asset.type}
        </div>
      </div>
    );
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VisualEditorWorkspace
        mode={gameEditorMode}
        showToolbar={true}
        showTopbar={true}
        showInspector={true}
        showLayers={true}
        showAssetPicker={true}  // Enable asset picker panel
        enableSnapGuides={true}
      />
    </div>
  );
}

/**
 * Asset Picker Integration:
 * 
 * 1. Configure in EditorMode:
 *    mode.assetPickerConfig = {
 *      title: 'Panel title',
 *      // Additional config
 *    }
 * 
 * 2. Pass Assets:
 *    - Define asset array with: name, path, type
 *    - Can load from API, file system, etc.
 * 
 * 3. Handle Selection:
 *    - onAssetSelect callback receives asset path
 *    - Automatically creates image element by default
 *    - Can customize behavior via API
 * 
 * 4. Custom Rendering:
 *    - Use renderAsset prop for custom UI
 *    - Full control over asset display
 *    - Add metadata, previews, etc.
 * 
 * 5. Search & Filter:
 *    - Built-in search functionality
 *    - Searches asset names
 *    - Case-insensitive
 * 
 * Asset Object Structure:
 * {
 *   name: string;        // Display name
 *   path: string;        // URL or file path
 *   type?: string;       // Optional category
 *   metadata?: any;      // Custom metadata
 * }
 * 
 * Use Cases:
 * - Game asset management
 * - Image libraries
 * - Icon pickers
 * - Media galleries
 * - Component libraries
 */

/**
 * Advanced: Dynamic Asset Loading
 */
export function DynamicAssetPickerExample() {
  const [assets, setAssets] = useState(mockAssets);
  const [loading, setLoading] = useState(false);

  // Load assets from API
  const loadAssetsFromAPI = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, fetch from API
      // const response = await fetch('/api/assets');
      // const data = await response.json();
      
      const newAssets = [
        ...mockAssets,
        {
          name: 'Loaded Asset',
          path: 'https://via.placeholder.com/150/667eea/ffffff?text=Loaded',
          type: 'dynamic'
        }
      ];
      
      setAssets(newAssets);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload custom asset
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAssets(prev => [
        ...prev,
        {
          name: file.name,
          path: dataUrl,
          type: 'uploaded'
        }
      ]);
    };
    reader.readAsDataURL(file);
  }, []);

  const mode: EditorMode = {
    id: 'dynamic-assets',
    name: 'Dynamic Assets',
    canvasSize: { width: 1200, height: 800 },
    assetPickerConfig: {
      title: 'Asset Library',
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button onClick={loadAssetsFromAPI} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Assets'}
        </button>
        <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button as="span">Upload Asset</button>
        </label>
        <span style={{ marginLeft: '10px' }}>
          Total Assets: {assets.length}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <VisualEditorWorkspace
          mode={mode}
          showAssetPicker={true}
        />
      </div>
    </div>
  );
}
