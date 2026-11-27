import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';

if (window.wp?.blocks) {
  registerBlockType(metadata.name, {
    edit: Edit,
    save: () => null // Dynamic rendering handled by render.php
  });
}

// registerBlockType(metadata.name, {
//   edit: Edit,
//   save: () => null // Dynamic rendering handled by render.php
// });
