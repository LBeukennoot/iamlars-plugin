import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const { skill, rating } = attributes;

  const blockProps = useBlockProps({
    className: 'flex items-center justify-between gap-4 w-full pb-2 max-w-sm!'
  });

  const handleRate = (value) => {
    setAttributes({ rating: rating === value ? value - 1 : value });
  };

  return (
    <div {...blockProps}>
      {/* Skill Label (Left) */}
      <RichText
        tagName="span"
        value={skill}
        onChange={(value) => setAttributes({ skill: value })}
        placeholder="Skill name (e.g. WordPress)..."
        allowedFormats={[]}
        className="font-sans text-secondary lowercase focus:outline-none"
      />

      {/* 1-5 Interactive Score Dots (Right) */}
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
  );
}