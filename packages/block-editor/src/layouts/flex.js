/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
} from '@wordpress/icons';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { appendSelectors } from './utils';
import useSetting from '../components/use-setting';
import { BlockControls, JustifyContentControl } from '../components';

// Used with the default, horizontal flex orientation.
const justifyContentMap = {
	left: 'flex-start',
	right: 'flex-end',
	center: 'center',
	'space-between': 'space-between',
};

// Used with the vertical (column) flex orientation.
const alignItemsMap = {
	left: 'flex-start',
	right: 'flex-end',
	center: 'center',
};

export default {
	name: 'flex',
	label: __( 'Flex' ),
	inspectorControls: function FlexLayoutInspectorControls( {
		layout = {},
		onChange,
	} ) {
		return (
			<FlexLayoutJustifyContentControl
				layout={ layout }
				onChange={ onChange }
			/>
		);
	},
	toolBarControls: function FlexLayoutToolbarControls( {
		layout = {},
		onChange,
		layoutBlockSupport,
	} ) {
		if ( layoutBlockSupport?.allowSwitching ) {
			return null;
		}
		return (
			<BlockControls group="block" __experimentalShareWithChildBlocks>
				<FlexLayoutJustifyContentControl
					layout={ layout }
					onChange={ onChange }
					isToolbar
				/>
			</BlockControls>
		);
	},
	save: function FlexLayoutStyle( { selector, layout } ) {
		const { orientation = 'horizontal' } = layout;
		const blockGapSupport = useSetting( 'spacing.blockGap' );
		const hasBlockGapStylesSupport = blockGapSupport !== null;
		const justifyContent =
			justifyContentMap[ layout.justifyContent ] || 'flex-start';
		const rowOrientation = `
		flex-direction: row;
		align-items: center;
		justify-content: ${ justifyContent };
		`;
		const alignItems =
			alignItemsMap[ layout.justifyContent ] || 'flex-start';
		const columnOrientation = `
		flex-direction: column;
		align-items: ${ alignItems };
		`;
		return (
			<style>{ `
				${ appendSelectors( selector ) } {
					display: flex;
					gap: ${
						hasBlockGapStylesSupport
							? 'var( --wp--style--block-gap, 0.5em )'
							: '0.5em'
					};
					flex-wrap: wrap;
					${ orientation === 'horizontal' ? rowOrientation : columnOrientation }
				}

				${ appendSelectors( selector, '> *' ) } {
					margin: 0;
				}
			` }</style>
		);
	},
	getOrientation( layout ) {
		const { orientation = 'horizontal' } = layout;
		return orientation;
	},
	getAlignments() {
		return [];
	},
};

function FlexLayoutJustifyContentControl( {
	layout,
	onChange,
	isToolbar = false,
} ) {
	const { justifyContent = 'left', orientation = 'horizontal' } = layout;
	const onJustificationChange = ( value ) => {
		onChange( {
			...layout,
			justifyContent: value,
		} );
	};
	const allowedControls = [ 'left', 'center', 'right' ];
	if ( orientation === 'horizontal' ) {
		allowedControls.push( 'space-between' );
	}
	if ( isToolbar ) {
		return (
			<JustifyContentControl
				allowedControls={ allowedControls }
				value={ justifyContent }
				onChange={ onJustificationChange }
				popoverProps={ {
					position: 'bottom right',
					isAlternate: true,
				} }
			/>
		);
	}

	const justificationOptions = [
		{
			value: 'left',
			icon: justifyLeft,
			label: __( 'Justify items left' ),
		},
		{
			value: 'center',
			icon: justifyCenter,
			label: __( 'Justify items center' ),
		},
		{
			value: 'right',
			icon: justifyRight,
			label: __( 'Justify items right' ),
		},
	];
	if ( orientation === 'horizontal' ) {
		justificationOptions.push( {
			value: 'space-between',
			icon: justifySpaceBetween,
			label: __( 'Space between items' ),
		} );
	}

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<legend>{ __( 'Justification' ) }</legend>
			<div>
				{ justificationOptions.map( ( { value, icon, label } ) => {
					return (
						<Button
							key={ value }
							label={ label }
							icon={ icon }
							isPressed={ justifyContent === value }
							onClick={ () => onJustificationChange( value ) }
						/>
					);
				} ) }
			</div>
		</fieldset>
	);
}
