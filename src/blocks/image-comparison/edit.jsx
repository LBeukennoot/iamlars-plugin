import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
  InspectorControls,
  RichText
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

function ImageSlot({
  label,
  imageUrl,
  imageAlt,
  tagText,
  tagPosition = 'left',
  onChangeTag,
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
                className="bg-primary text-white text-xs md:text-sm font-medium px-4 py-2 rounded-full cursor-pointer shadow hover:opacity-90 transition-opacity whitespace-nowrap"
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

      {/* Inline Editable Tag Pill */}
      <div
        className={`absolute top-3 ${
          tagPosition === 'left' ? 'left-3' : 'right-3'
        } z-10`}
      >
        <RichText
          tagName="span"
          value={tagText}
          onChange={onChangeTag}
          placeholder="Add tag..."
          allowedFormats={[]}
          className="inline-block px-3 py-1 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-medium rounded-full shadow-sm min-w-12 text-center focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Action overlay on hover */}
      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-2">
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelect}
            allowedTypes={['image']}
            render={({ open }) => (
              <button
                type="button"
                onClick={open}
                className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-full shadow hover:bg-slate-50 cursor-pointer"
              >
                Replace
              </button>
            )}
          />
        </MediaUploadCheck>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full shadow hover:bg-red-700 cursor-pointer"
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
    imageBTag
  } = attributes;

  const blockProps = useBlockProps({
    className:
      'relative flex w-full max-w-4xl aspect-video overflow-hidden rounded-3xl select-none font-sans'
  });

  return (
    <>
      {/* Sidebar Controls */}
      <InspectorControls>
        <PanelBody title="Image Tags" initialOpen={true}>
          <TextControl
            label="Image 1 Tag (Left)"
            value={imageATag}
            placeholder="e.g. Before"
            onChange={(value) => setAttributes({ imageATag: value })}
          />
          <TextControl
            label="Image 2 Tag (Right)"
            value={imageBTag}
            placeholder="e.g. After"
            onChange={(value) => setAttributes({ imageBTag: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {/* Left Slot (Image 1) */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <ImageSlot
            label="Image 1"
            imageUrl={imageAUrl}
            imageAlt={imageAAlt}
            tagText={imageATag}
            tagPosition="left"
            onChangeTag={(value) => setAttributes({ imageATag: value })}
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
            tagText={imageBTag}
            tagPosition="right"
            onChangeTag={(value) => setAttributes({ imageBTag: value })}
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
    </>
  );
}