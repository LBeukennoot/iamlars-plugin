import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  InspectorControls,
  RichText
} from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

function ImageSlot({
  label,
  imageUrl,
  imageAlt,
  onSelect,
  onRemove
}) {
  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center p-4">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelect}
            allowedTypes={['image']}
            render={({ open }) => (
              <button
                type="button"
                onClick={open}
                className="bg-primary text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full clickable shadow hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Select {label}
              </button>
            )}
          />
        </MediaUploadCheck>
      </div>
    );
  }

  return (
    <div className="group relative w-full h-full">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-full object-cover pointer-events-none rounded-none!"
      />

      {/* Action overlay on hover */}
      <div className="absolute inset-0 bg-slate-900/50 opacity-100 sm:opacity-0! group-hover:opacity-100! transition-opacity flex flex-wrap items-center justify-center gap-2 p-2">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelect}
            allowedTypes={['image']}
            render={({ open }) => (
              <button
                type="button"
                onClick={open}
                className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-full shadow hover:bg-slate-50 clickable"
              >
                Replace
              </button>
            )}
          />
        </MediaUploadCheck>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full shadow hover:bg-red-700 clickable"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function Edit({ attributes, setAttributes }) {
  const {
    imageAUrl,
    imageAAlt,
    imageATag,
    imageBUrl,
    imageBAlt,
    imageBTag,
    aspectRatio = '16/9'
  } = attributes;

  const blockProps = useBlockProps({
    className: 'flex flex-col gap-5 w-full select-none font-sans'
  });

  return (
    <>
      {/* Sidebar Controls */}
      <InspectorControls>
        <PanelBody title="Layout" initialOpen={true}>
          <SelectControl
            label="Aspect Ratio"
            value={aspectRatio}
            options={[
              { label: '16:9 (Landscape)', value: '16/9' },
              { label: '4:3 (Classic)', value: '4/3' },
              { label: '1:1 (Square)', value: '1/1' },
              { label: '5:6 (Portrait)', value: '5/6' },
              { label: '3:4 (Portrait)', value: '3/4' },
              { label: '9:16 (Vertical)', value: '9/16' }
            ]}
            onChange={(value) => setAttributes({ aspectRatio: value })}
          />
        </PanelBody>

        <PanelBody title="Image Tags" initialOpen={true}>
          <TextControl
            label="Left Image Tag"
            value={imageATag}
            placeholder="add tag..."
            onChange={(value) => setAttributes({ imageATag: value })}
          />
          <TextControl
            label="Right Image Tag"
            value={imageBTag}
            placeholder="add tag..."
            onChange={(value) => setAttributes({ imageBTag: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {/* Comparison Image Box */}
        <div
          className="relative flex w-full overflow-hidden rounded-3xl"
          style={{ aspectRatio }}
        >
          {/* Left Slot (Image 1) */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <ImageSlot
              label="Image 1"
              imageUrl={imageAUrl}
              imageAlt={imageAAlt}
              onSelect={(media) =>
                setAttributes({
                  imageAId: media.id,
                  imageAUrl: media.url,
                  imageAAlt: media.alt || ''
                })
              }
              onRemove={() =>
                setAttributes({
                  imageAId: null,
                  imageAUrl: '',
                  imageAAlt: '',
                  imageATag: ''
                })
              }
            />
          </div>

          {/* Right Slot (Image 2) */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <ImageSlot
              label="Image 2"
              imageUrl={imageBUrl}
              imageAlt={imageBAlt}
              onSelect={(media) =>
                setAttributes({
                  imageBId: media.id,
                  imageBUrl: media.url,
                  imageBAlt: media.alt || ''
                })
              }
              onRemove={() =>
                setAttributes({
                  imageBId: null,
                  imageBUrl: '',
                  imageBAlt: '',
                  imageBTag: ''
                })
              }
            />
          </div>

          {/* Center Divider & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary pointer-events-none flex items-center justify-center -translate-x-1/2 z-20"
            style={{ left: '50%' }}
          >
            <div className="absolute w-8 h-8 bg-white rounded-full border-4 border-primary shadow-sm" />
          </div>
        </div>

        {/* Tag Pills Underneath */}
        {(imageAUrl || imageBUrl || imageATag || imageBTag) && (
          <div className="flex justify-between gap-2">
            <div className="min-w-0 max-w-[calc(50%-0.25rem)]">
              {(imageAUrl || imageATag) && (
                <RichText
                  tagName="span"
                  value={imageATag}
                  onChange={(value) => setAttributes({ imageATag: value })}
                  placeholder="add tag..."
                  allowedFormats={[]}
                  className="pill-tag inline-block bg-white text-secondary shadow-md truncate whitespace-nowrap! max-w-full"
                />
              )}
            </div>

            <div className="min-w-0 max-w-[calc(50%-0.25rem)]">
              {(imageBUrl || imageBTag) && (
                <RichText
                  tagName="span"
                  value={imageBTag}
                  onChange={(value) => setAttributes({ imageBTag: value })}
                  placeholder="add tag..."
                  allowedFormats={[]}
                  className="pill-tag inline-block bg-white text-secondary shadow-md truncate whitespace-nowrap! max-w-full"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}