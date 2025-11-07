/**
 * Asset Picker Panel
 *
 * Displays project assets that can be dragged/clicked to use in the editor.
 * Integrates with useProjectAssets to show game assets.
 */

import React from "react";
import { ScrollArea } from "@/ui/scroll-area";
import { Input } from "@/ui/input";
import { Search } from "lucide-react";

export interface AssetPickerProps {
  /** List of assets to display */
  assets: Array<{
    name: string;
    path: string;
    type?: string;
  }>;

  /** Callback when an asset is selected */
  onAssetSelect?: (assetPath: string) => void;

  /** Custom render function for asset items */
  renderAsset?: (asset: { name: string; path: string; type?: string }) => React.ReactNode;

  /** Custom CSS class */
  className?: string;

  /** Title for the panel */
  title?: string;
}

/**
 * Asset Picker component that displays available assets
 */
export const AssetPicker: React.FC<AssetPickerProps> = ({
  assets,
  onAssetSelect,
  renderAsset,
  className = "",
  title = "Assets",
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter assets based on search query
  const filteredAssets = React.useMemo(() => {
    if (!searchQuery) return assets;
    const query = searchQuery.toLowerCase();
    return assets.filter((asset) => asset.name.toLowerCase().includes(query));
  }, [assets, searchQuery]);

  // Default asset renderer
  const defaultRenderAsset = React.useCallback(
    (asset: { name: string; path: string; type?: string }) => {
      const isImage = asset.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);

      return (
        <div
          key={asset.path}
          className="flex flex-col items-center p-2 border rounded hover:bg-accent cursor-pointer transition-colors"
          onClick={() => onAssetSelect?.(asset.path)}
          title={asset.name}
        >
          {isImage ? (
            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded mb-1">
              <img
                src={`asset:///${asset.path}`}
                alt={asset.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="text-xs text-muted-foreground">Image</div>
                  `;
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded mb-1">
              <div className="text-xs text-muted-foreground">File</div>
            </div>
          )}
          <div className="text-xs text-center truncate w-full">{asset.name}</div>
        </div>
      );
    },
    [onAssetSelect]
  );

  const assetRenderer = renderAsset || defaultRenderAsset;

  return (
    <div className={`flex flex-col bg-background border-t ${className || 'h-full'}`}>
      {/* Header */}
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Asset Grid */}
      <ScrollArea className="flex-1">
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 p-3">
            {filteredAssets.map((asset) => assetRenderer(asset))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            {searchQuery ? "No assets found" : "No assets available"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AssetPicker;
