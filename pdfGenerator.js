import {jsPDF} from "jspdf";
import {sudokuInit} from "./sudoku.js";


function draw_page(pageSize = [168, 238], boardMat, solutionMat) {

    const doc = new jsPDF({
        format: pageSize
    });

    generate_board(doc, pageSize, boardMat, solutionMat);
    doc.text("PDF Generator Test", 10, 10);
    doc.save("a4.pdf")
}

;

let docInfo = class {
    constructor(sudokuMats, solutionMats, pageSize) {
        this.sudokuMats = sudokuMats;
        this.solutionMats = solutionMats;
        this.puzzleNum = sudokuMats.length;
    }

    getPage(pageNum) {
        let puzzleWithLastAns = [undefined, undefined];
        if (pageNum < 0 || pageNum > this.puzzleNum) {
            console.log("err");
        } else {
            if (pageNum < this.puzzleNum) {
                puzzleWithLastAns[0] = this.sudokuMats[pageNum];
            }
            if (pageNum > 0) {
                puzzleWithLastAns[1] = this.solutionMats[pageNum - 1];
            }
        }
        return puzzleWithLastAns;
    }
}

function pdfGenerator() {
    let sudoku = sudokuInit();
    let file = undefined;
    let doc_info = undefined;
    let page_size = undefined;

    function initialize(psize = [168, 238], num = 1, difficulty = "medium") {
        page_size = psize;
        file = new jsPDF({
            format: psize
        });
        let puzzle_info = _generate_sudoku(num, difficulty);
        doc_info = new docInfo(puzzle_info[0], puzzle_info[1]);
    }

    function drawPDF() {

    }

    // generate multiple sudoku puzzles and return [[puzzles][solutions]]

    function _generate_sudoku(num = 1, difficulty = "medium") {
        let puzzles_solutions = [[], []];
        for (let i = 0; i < num; i++) {
            let puzzle = sudoku.generate(difficulty);
            let solution = sudoku.solve(puzzle);
            puzzles_solutions[0].push(puzzle);
            puzzles_solutions[1].push(solution);
        }
        return puzzles_solutions;
    }

    // draw a page using a single puzzle
    function _draw_board(puzzleMat) {
        let pageWidth = page_size[0];
        let pageHeight = page_size[1];
        let leftTop = [pageWidth * 0.1, pageWidth * 0.1];
        let boardWidth = pageWidth * 0.8;
        file.setLineJoin("square");
        for (let index = 0; index < 10; index++) {
            // set the line styles
            if (index === 3 || index === 6) { // the inner division line
                file.setDrawColor(200, 200, 200)
                file.setLineWidth(0.9);
            } else if (index === 0 || index === 9) { // the boundary
                console.log("boundary")
                file.setDrawColor(100, 100, 100);
                file.setLineWidth(0.9);
            } else { // normal lines
                file.setDrawColor(200, 200, 200);
                file.setLineWidth(0.3);
            }
            let west = [leftTop[0], leftTop[1] + index * boardWidth / 9];
            let east = [west[0] + boardWidth, west[1]];
            file.line(west[0], west[1], east[0], east[1]);
            let north = [leftTop[0] + index * boardWidth / 9, leftTop[1]];
            let south = [north[0], north[1] + boardWidth];
            file.line(north[0], north[1], south[0], south[1]);
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let num = puzzleMat[row][col];
                if (num !== ".") {
                    // console.log(num);
                    let positionX = leftTop[0] + (row + 1 / 2) * boardWidth / 9;
                    let positionY = leftTop[1] + (col + 1 / 2) * boardWidth / 9;
                    file.text(num, positionX, positionY);
                }
            }
        }

    }

    // draw a page using solution
    function _draw_sketch(solutionMat) {

    }

    function _draw_solution(solutionMat) {

    }
}