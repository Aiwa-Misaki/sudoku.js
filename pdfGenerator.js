import {jsPDF} from "jspdf";
import {sudokuInit} from "./sudoku.js";


let lineStyle = class {
    constructor(width, color) {
        this.width = width;
        this.color = color;
    }
}
let boardStyle = class {
    constructor(borderStyle, innerStyle, normalStyle, shadowColor, fontSize) {
        this.borderStyle = borderStyle;
        this.innerStyle = innerStyle;
        this.normalStyle = normalStyle;
        this.shadowColor = shadowColor;
        this.fontSize = fontSize;
    }
}
let sizePos = class {
    constructor(leftTop, width, height_width_ratio) {
        this.leftTop = leftTop;
        this.width = width;
        this.height_width_ratio = height_width_ratio;
    }
}

const BOARD_STYLE = {
    PUZZLE_STYLE: new boardStyle(new lineStyle(0.9, [100, 100, 100]), new lineStyle(0.9, [200, 200, 200]), new lineStyle(0.3, [200, 200, 200]), [240, 240, 240], 22),
    SKETCH_STYLE: new boardStyle(new lineStyle(0.8, [220, 220, 220]), new lineStyle(0.8, [220, 220, 220]), new lineStyle(0.3, [220, 220, 220]), [240, 240, 240], 0),
    ANSWER_STYLE: new boardStyle(new lineStyle(0.4, [100, 100, 100]), new lineStyle(0.4, [100, 100, 100]), new lineStyle(0.2, [100, 100, 100]), [255, 255, 255], 9)
}


function pdfGenerator() {
    let sudoku = sudokuInit();
    let file = undefined;
    let doc_info = undefined;
    let page_size = undefined;

    let BOARD_SIZE_POS = undefined;

    function initialize(psize = [168, 238], num = 1, difficulty = "medium") {
        page_size = psize;
        file = new jsPDF({
            format: psize
        });
        BOARD_SIZE_POS = {
            PUZZLE: new sizePos([psize[0] * 0.125, psize[1] * 0.12], psize[0] * 0.75, 1),
            SKETCH: new sizePos([psize[0] * 0.125, psize[1] * 0.18 + psize[0] * 0.75], psize[0] * 0.75, 0.5),
            ANSWER: new sizePos([psize[0] * 0.05, psize[0] * 0.05], psize[0] * 0.16, 1)
        }
        let puzzle_info = _generate_sudoku(num, difficulty);
        doc_info = new docInfo(puzzle_info[0], puzzle_info[1]);
    }

    function drawPDF() {
        let puz = sudoku.generate(34);
        let ans = sudoku.solve(puz);
        _draw_puzzle(puz, BOARD_STYLE.PUZZLE_STYLE, BOARD_SIZE_POS.PUZZLE);
        // _draw_puzzle(ans, BOARD_STYLE.ANSWER_STYLE, BOARD_SIZE_POS.ANSWER);
        _draw_puzzle(undefined, BOARD_STYLE.SKETCH_STYLE, BOARD_SIZE_POS.SKETCH)
        file.setTextColor("black");
        file.setFontSize(20);
        file.text("Daily Sudoku ___ ___ ___", page_size[0] * 0.05, page_size[0] * 0.1);
        file.setTextColor(150, 150, 150);
        file.setFontSize(15);
        file.text("SKETCH AREA", page_size[0] * 0.15, page_size[1] * 0.15 + page_size[0] * 0.75, {
            align: "center",
            baseline: "middle"
        });
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
    function _draw_puzzle(puzzleMat, style, sizePos) {
        let left_top = sizePos.leftTop;
        let board_width = sizePos.width;
        let height_width_ratio = sizePos.height_width_ratio;
        let board_height = board_width * height_width_ratio;
        puzzleMat = sudoku.board_string_to_grid(puzzleMat);
        file.setFont("Courier");
        file.setFontSize(style.fontSize);
        // draw the text
        if (puzzleMat.length !== 0)
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    let num = puzzleMat[row][col];
                    if (num !== ".") {
                        // console.log(num);
                        let positionX = left_top[0] + row * board_width / 9;
                        let positionY = left_top[1] + col * board_height / 9;
                        // console.log(positionX, positionY)
                        file.setFillColor(style.shadowColor[0], style.shadowColor[1], style.shadowColor[2]);
                        // console.log(left_top, board_width, board_height)
                        file.rect(positionX, positionY, board_width / 9, board_width / 9, 'F');
                        file.text(num, positionX + 0.5 * board_width / 9, positionY + 0.5 * board_height / 9, {
                            align: "center",
                            baseline: "middle"
                        });
                    }
                }
            }
        _draw_line(style, sizePos);
    }

    // draw a page using solution
    function _draw_sketch() {

    }

    function _draw_solution(solutionMat, left_top, board_width, height_width_ratio) {

    }

    // draw chessboard with 9 cols and 9 rows
    // can be used in puzzle, sketch and solution
    function _draw_line(style, sizePos) {
        let boardWidth = sizePos.width;
        let boardHeight = boardWidth * sizePos.height_width_ratio;
        let left_top = sizePos.leftTop;
        file.setLineJoin(2);
        file.setLineCap(2);
        // draw the internal lines
        for (let index = 1; index < 9; index++) {
            // set the line styles
            if (index === 3 || index === 6) { // the inner division line
                file.setDrawColor(style.innerStyle.color[0], style.innerStyle.color[1], style.innerStyle.color[2])
                file.setLineWidth(style.innerStyle.width);
            } else { // normal lines
                file.setDrawColor(style.normalStyle.color[0], style.normalStyle.color[1], style.normalStyle.color[2]);
                file.setLineWidth(style.normalStyle.width);
            }
            _draw_crossline(index);
        }
        // draw the borderlines
        for (let index = 0; index <= 9; index += 9) {
            file.setDrawColor(style.borderStyle.color[0], style.borderStyle.color[1], style.borderStyle.color[2]);
            file.setLineWidth(style.borderStyle.width);
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
}


pdfGenerator();