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
        selector: `node[layer = ${layer}].external`,
        style: {
            label: 'data(areaName)',
            'font-size': 16,
            'z-index': 1001,
            'text-background-color': '#aadbff',
            'text-background-opacity': 1,
            'text-background-padding': '1px',
            'background-color': '#aadbff',
            'border-color': '#aadbff',
        },
    },
    {
        selector: 'node[direction = "north"].external',
        style: {
            'text-valign': 'top',
            'text-halign': 'center',
        },
    },
    {
        selector: 'node[direction = "south"].external',
        style: {
            'text-valign': 'bottom',
            'text-halign': 'center',
        },
    },
    {
        selector: 'node[direction = "east"].external',
        style: {
            'text-valign': 'center',
            'text-halign': 'right',
            'text-margin-x': -7,
        },
    },
    {
        selector: 'node[direction = "west"].external',
        style: {
            'text-valign': 'center',
            'text-halign': 'left',
            'text-margin-x': 7,
        },
    },
    {
        selector: 'node[direction = "up"].external',
        style: {
            'text-valign': 'center',
            'text-halign': 'center',
        },
    },
    {
        selector: 'node[direction = "down"].external',
        style: {
            'text-valign': 'center',
            'text-halign': 'center',
        },
    },
    {
        selector: `node[layer != ${layer}]`,
        style: {
            display: 'none',
        },
    },
];
