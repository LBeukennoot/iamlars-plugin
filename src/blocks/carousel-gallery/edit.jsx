import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const { images = [] } = attributes;
  const blockProps = useBlockProps({
    className: 'p-6 bg-slate-50 border border-slate-200 rounded-3xl'
  });

  const handleSelectImages = (selectedMedia) => {
    const formatted = selectedMedia.map((media) => ({
      id: media.id,
      url: media.sizes?.large?.url || media.url,
      alt: media.alt || media.title || ''
    }));
    setAttributes({ images: formatted });
  };

  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setAttributes({ images: updated });
  };

  return (
    <div {...blockProps}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base font-display">Carousel Gallery</h3>
          <p className="text-xs text-slate-500">
            {images.length} {images.length === 1 ? 'image' : 'images'} selected
          </p>
        </div>

        <MediaUploadCheck>
          <MediaUpload
            onSelect={handleSelectImages}
            allowedTypes={['image']}
            multiple={true}
            gallery={true}
            value={images.map((img) => img.id)}
            render={({ open }) => (
              <button
                type="button"
                onClick={open}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-full shadow hover:opacity-90 cursor-pointer"
              >
                {images.length > 0 ? 'Edit Gallery' : 'Add Images'}
              </button>
            )}
          />
        </MediaUploadCheck>
      </div>

      {images.length === 0 ? (
        <div className="w-full aspect-[21/9] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white">
          <p className="text-sm text-slate-500 font-medium">No images selected</p>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={handleSelectImages}
              allowedTypes={['image']}
              multiple={true}
              gallery={true}
              render={({ open }) => (
                <button
                  type="button"
                  onClick={open}
                  className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-full cursor-pointer"
                >
                  Select Images
                </button>
              )}
            />
          </MediaUploadCheck>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="group relative aspect-video rounded-xl overflow-hidden bg-slate-200 border border-slate-200"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}