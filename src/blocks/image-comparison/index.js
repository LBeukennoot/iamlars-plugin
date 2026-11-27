import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

if (window.wp?.blocks) {
  registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: () => null
  });
}
