import { useState } from '@wordpress/element';
import {
  useBlockProps,
  RichText,
  BlockControls,
  __experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Popover } from '@wordpress/components';

const linkIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z" />
  </svg>
);

const linkOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <path d="M15.6 7.3h-.7l1.6-3.5-.9-.4-3.9 8.5H9v1.5h2l-1.3 2.8H8.4c-2 0-3.7-1.7-3.7-3.7s1.7-3.7 3.7-3.7H10V7.3H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H9l-1.4 3 .9.4 5.7-12.5h1.4c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.9 0 5.2-2.3 5.2-5.2 0-2.9-2.4-5.2-5.2-5.2z" />
  </svg>
);

export default function Edit({ attributes, setAttributes }) {
  const { skill, rating, url, opensInNewTab } = attributes;
  const [isEditingURL, setIsEditingURL] = useState(false);

  const blockProps = useBlockProps({
    className: 'flex items-center justify-between gap-4 w-full pb-2 max-w-sm! ml-0!'
  });

  const handleRate = (value) => {
    setAttributes({ rating: rating === value ? value - 1 : value });
  };

  const unlink = () => {
    setAttributes({ url: '', opensInNewTab: false });
    setIsEditingURL(false);
  };

  return (
    <>
      <BlockControls group="block">
        <ToolbarGroup>
          {!url ? (
            <ToolbarButton
              name="link"
              icon={linkIcon}
              title="Link"
              onClick={() => setIsEditingURL(true)}
            />
          ) : (
            <ToolbarButton
              name="link"
              icon={linkOffIcon}
              title="Unlink"
              isActive={true}
              onClick={unlink}
            />
          )}
        </ToolbarGroup>
      </BlockControls>

      {isEditingURL && (
        <Popover
          placement="top"
          onClose={() => setIsEditingURL(false)}
          focusOnMount="firstElement"
        >
          <LinkControl
            value={{ url, opensInNewTab }}
            onChange={(nextValue) => {
              setAttributes({
                url: nextValue.url ?? '',
                opensInNewTab: Boolean(nextValue.opensInNewTab)
              });
            }}
            onRemove={unlink}
          />
        </Popover>
      )}

      <div {...blockProps}>
        <RichText
          tagName="span"
          value={skill}
          onChange={(value) => setAttributes({ skill: value })}
          placeholder="Skill name (e.g. WordPress)..."
          allowedFormats={[]}
          className={`font-sans text-secondary lowercase focus:outline-none ${
            url ? 'underline decoration-primary underline-offset-4' : ''
          }`}
        />

        <div
          className="flex items-center gap-1.5 shrink-0"
          role="radiogroup"
          aria-label="Proficiency rating"
        >
          {[1, 2, 3, 4, 5].map((step) => {
            const isFilled = step <= rating;
            return (
              <button
                key={step}
                type="button"
                onClick={() => handleRate(step)}
                aria-label={`${step} out of 5`}
                className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                  isFilled ? 'bg-primary' : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}