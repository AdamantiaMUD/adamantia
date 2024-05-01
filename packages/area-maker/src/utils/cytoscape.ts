/* eslint-disable @typescript-eslint/naming-convention, import/prefer-default-export */
import type { Stylesheet } from 'cytoscape';

const baseStyle: Stylesheet[] = [
    {
        selector: '.roomHover',
        style: {
            label: 'data(label)',
            'font-size': 16,
            'z-index': 1001,
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-padding': '1px',
            'text-border-width': 1,
            'text-border-color': '#000',
            'text-border-opacity': 1,
        },
    },
    {
        selector: 'edge',
        style: {
            'curve-style': 'haystack',
            'haystack-radius': 0,
            width: 1,
            opacity: 1,
            'line-color': '#000',
        },
    },
];

export const makeCytoscapeStyles = (layer: number): Stylesheet[] => [
    ...baseStyle,
    {
        selector: `node[layer = ${layer}]`,
        style: {
            height: 10,
            width: 10,
            'border-width': '1px',
            'border-color': '#777',
            'border-style': 'solid',
            'background-color': '#aaa',
            shape: 'rectangle',
        },
    },
    {
        selector: `node[layer = ${layer}]:selected`,
        style: {
            'background-color': '#00f',
            'border-color': '#00f',
        },
    },
    {
        selector: `node[layer != ${layer}]`,
        style: {
            display: 'none',
        },
    },
];
