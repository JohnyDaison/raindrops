const Air = Symbol();
const Terrain = Symbol();
const Water = Symbol();

const paperWidth = 1280;
const cellSize = 30;
const colorMap = {};
colorMap[Air] = "#dff1f7";
colorMap[Terrain] = "black";
colorMap[Water] = "blue";

const defaultHeights = [0,1,0,2,1,0,1,3,2,1,2,1];
const minRandomWidth = 3;
const maxRandomWidth = 20;
const maxRandomHeight = 5;

var grid;
var graph;
var paper;
var maxHeight;

function findWaterHeightAtIndex(terrainHeights, index) {
    const leftSide = terrainHeights.slice(0, index);
    const rightSide = terrainHeights.slice(index+1);

    const maxLeft = Math.max(0, ...leftSide);
    const maxRight = Math.max(0, ...rightSide);

    return Math.min(maxLeft, maxRight);
}

function trap(terrainHeights) {
    maxHeight = Math.max(...terrainHeights);
    grid = [];
    let totalWater = 0;

    terrainHeights.forEach((terrainHeight, index) => {
        const waterHeight = findWaterHeightAtIndex(terrainHeights, index);
        totalWater += Math.max(0, waterHeight - terrainHeight);
        
        grid[index] = [];
        for(let i = 0; i < maxHeight; i++) {
            grid[index][i] = i < terrainHeight ? Terrain : (i < waterHeight ? Water : Air);
        }
    });

    return totalWater;
}

function initJoint() {
    const namespace = joint.shapes;

    graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    paper = new joint.dia.Paper({
        el: document.getElementById('myholder'),
        model: graph,
        width: paperWidth,
        height: cellSize,
        gridSize: 1,
        cellViewNamespace: namespace
    });
}

function resizePaper(height) {
    graph.clear();
    paper.setDimensions(paperWidth, height);
}

function drawGrid() {
    grid.forEach((column, columnIndex) => {
        column.forEach((cell, cellIndex) => {
            createGridCell(cellSize * columnIndex, cellSize * (maxHeight-cellIndex), colorMap[cell]);
        });
    });
}

function createGridCell(x, y, color) {
    const rect = new joint.shapes.standard.Rectangle();
    rect.position(x, y);
    rect.resize(cellSize, cellSize);
    rect.attr({
        body: {
            fill: color,
            stroke: 'none'
        }
    });
    rect.addTo(graph);
}

function analyzeHeights(terrainHeights) {
    const totalWater = trap(terrainHeights);

    resizePaper((maxHeight+2) * cellSize);
    drawGrid();

    document.getElementById('totalDisplay').innerText = "Total Water: " + totalWater;
}

function generateHeights() {
    const heights = [];
    const width = minRandomWidth + Math.ceil(Math.random() * (maxRandomWidth - minRandomWidth));
    for(let i = 0; i < width; i++) {
        heights[i] = Math.floor(Math.random() * (maxRandomHeight + 1))
    }

    return heights;
}

function randomizeHeights() {
    analyzeHeights(generateHeights());
}

initJoint();

analyzeHeights(defaultHeights);
