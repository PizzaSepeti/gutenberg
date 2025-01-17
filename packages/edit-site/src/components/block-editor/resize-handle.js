/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { LEFT, RIGHT } from '@wordpress/keycodes';
import { VisuallyHidden } from '@wordpress/components';

export default function ResizeHandle( { direction, resizeWidthBy } ) {
	function handleKeyDown( event ) {
		const { keyCode } = event;

		if (
			( direction === 'left' && keyCode === LEFT ) ||
			( direction === 'right' && keyCode === RIGHT )
		) {
			resizeWidthBy( 20 );
		} else if (
			( direction === 'left' && keyCode === RIGHT ) ||
			( direction === 'right' && keyCode === LEFT )
		) {
			resizeWidthBy( -20 );
		}
	}

	return (
		<>
			<button
				className={ `resizable-editor__drag-handle is-${ direction }` }
				aria-label={ __( 'Drag to resize' ) }
				aria-describedby={ `resizable-editor__resize-help-${ direction }` }
				onKeyDown={ handleKeyDown }
			/>
			<VisuallyHidden
				id={ `resizable-editor__resize-help-${ direction }` }
			>
				{ __( 'Use left and right arrow keys to resize the canvas.' ) }
			</VisuallyHidden>
		</>
	);
}
