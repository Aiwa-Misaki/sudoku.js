import {jsPDF} from "jspdf";
import {sudokuInit} from "./sudoku.js";


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
let boardStyle = class {

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
        let puz = sudoku.generate(34);
        let ans = sudoku.solve(puz);
        let ans_size = page_size[0] * 0.2;
        let puz_size = page_size[0] * 0.8;
        _draw_puzzle(puz, [page_size[0] * 0.1, page_size[0] * 0.2], puz_size, 1);
        _draw_puzzle(ans, [page_size[0] * 0.7, page_size[1] * 0.8], ans_size, 1)
        file.text("PDF Generator Test", 10, 10, page_size[0] * 0.2, 1);
        file.save("a4.pdf")
    }

    // generate multiple sudoku puzzles and return [[puzzles][solutions]]

    function _generate_sudoku(num = 1, difficulty = "hard") {
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
    function _draw_puzzle(puzzleMat, left_top, board_width, height_width_ratio) {
        let board_height = board_width * height_width_ratio;
        puzzleMat = sudoku.board_string_to_grid(puzzleMat);
        file.setFont("Courier");
        file.setFontSize(18);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let num = puzzleMat[row][col];
                if (num !== ".") {
                    // console.log(num);
                    let positionX = left_top[0] + row * board_width / 9;
                    let positionY = left_top[1] + col * board_height / 9;
                    file.setFillColor(235, 235, 235);
                    file.rect(positionX, positionY, board_width / 9, board_width / 9, 'F');
                    file.text(num, positionX + 0.5 * board_width / 9, positionY + 0.5 * board_height / 9, {
                        align: "center",
                        baseline: "middle"
                    });
                }
            }
        }
        _draw_line(1, left_top, board_width);
    }

    // draw a page using solution
    function _draw_sketch() {

    }

    function _draw_solution(solutionMat, left_top, board_width, height_width_ratio) {

    }

    // draw chessboard with 9 cols and 9 rows
    // can be used in puzzle, sketch and solution
    function _draw_line(height_width_ratio, left_top, width) {
        let boardWidth = width;
        let boardHeight = boardWidth * height_width_ratio;
        file.setLineJoin(2);
        file.setLineCap(2);
        // draw the internal lines
        for (let index = 1; index < 9; index++) {
            // set the line styles
            if (index === 3 || index === 6) { // the inner division line
                file.setDrawColor(200, 200, 200)
                file.setLineWidth(0.9);
            } else { // normal lines
                file.setDrawColor(200, 200, 200);
                file.setLineWidth(0.3);
            }
            _draw_crossline(index);
        }
        // draw the boundary lines
        for (let index = 0; index <= 9; index += 9) {
            file.setDrawColor(100, 100, 100);
            file.setLineWidth(0.9);
            _draw_crossline(index);
        }

        function _draw_crossline(index) {
            let west = [left_top[0], left_top[1] + index * boardHeight / 9];
            let east = [west[0] + boardWidth, west[1]];
            file.line(west[0], west[1], east[0], east[1]);
            let north = [left_top[0] + index * boardWidth / 9, left_top[1]];
            let south = [north[0], north[1] + boardHeight];
            file.line(north[0], north[1], south[0], south[1]);
        }
    }

    initialize();
    drawPDF();
    console.log(file.getFontList())
}


pdfGenerator();
