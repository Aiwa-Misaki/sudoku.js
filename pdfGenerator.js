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
        let puz = sudoku.generate("hard");
        let ans = sudoku.solve(puz);
        _draw_board(puz, [page_size[0] * 0.1, page_size[0] * 0.1], page_size[0] * 0.8, 1);
        _draw_line_shadow(1, [page_size[0] * 0.1, page_size[0] * 0.1], page_size[0] * 0.8, undefined);
        file.text("PDF Generator Test", 10, 10);
        file.save("a4.pdf")
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
    function _draw_board(puzzleMat, left_top, board_width, height_width_ratio) {
        let board_height = board_width * height_width_ratio;
        puzzleMat = sudoku.board_string_to_grid(puzzleMat);
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let num = puzzleMat[row][col];
                if (num !== ".") {
                    // console.log(num);
                    let positionX = left_top[0] + row * board_width / 9;
                    let positionY = left_top[1] + col * board_height / 9;
                    file.text(num, positionX + 0.5 * board_width / 9, positionY + 0.5 * board_height / 9, {
                        align: "center",
                        baseline: "middle"
                    });
                    file.setDrawColor(100, 100, 0);
                    file.rect(positionX, positionY, board_width / 9, board_width / 9);
                }
            }
        }

    }

    // draw a page using solution
    function _draw_sketch(solutionMat) {

    }

    function _draw_solution(solutionMat) {

    }

    // draw chessboard with 9 cols and 9 rows
    // can be used in puzzle, sketch and solution
    function _draw_line_shadow(height_width_ratio, left_top, width, positionArr) {
        let boardWidth = width;
        let boardHeight = boardWidth * height_width_ratio;
        file.setLineJoin("square");
        // _fill_cube(positionArr);
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

        // [[x1,y1],[x2,y2],...]
        function _fill_cube(positionArr) {
            for (let cube in positionArr) {
                let cube_left_top = [left_top[0] + cube[0] * boardWidth / 9, left_top[1] + cube[1] * boardHeight / 9];
                file.rect(cube_left_top[0], cube_left_top[1], boardWidth / 9, boardHeight / 9);
            }
        }
    }

    initialize();
    drawPDF();
}


pdfGenerator();