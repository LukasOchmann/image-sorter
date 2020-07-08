"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const index_1 = require("./index");
const FIXTURE_DIR = path_1.join(__dirname, "../test/fixtures");
describe("exiftool2", () => {
    it("should pipe png", done => {
        const exiftool = index_1.exec("-fast", "-");
        fs_1.createReadStream(path_1.join(FIXTURE_DIR, "placeholder.png")).pipe(exiftool);
        exiftool.on("exif", exif => {
            expect(exif.length).toEqual(1);
            expect(exif[0].FileType).toEqual("PNG");
            return done();
        });
    });
    it("should pipe jpeg with trailers", done => {
        const exiftool = index_1.exec("-");
        const stream = fs_1.createReadStream(path_1.join(FIXTURE_DIR, "subway.jpeg"));
        let ended = false;
        exiftool.on("exif", exif => {
            expect(ended).toEqual(true);
            expect(exif.length).toEqual(1);
            expect(exif[0].FileType).toEqual("JPEG");
            return done();
        });
        stream.on("end", () => (ended = true));
        stream.pipe(exiftool);
    });
    it("should pipe jpeg fast", done => {
        const exiftool = index_1.exec("-fast", "-");
        const stream = fs_1.createReadStream(path_1.join(FIXTURE_DIR, "subway.jpeg"));
        let ended = false;
        exiftool.on("exif", exif => {
            expect(ended).toEqual(false);
            expect(exif.length).toEqual(1);
            expect(exif[0].FileType).toEqual("JPEG");
        });
        stream.on("end", () => {
            ended = true;
            return done();
        });
        stream.pipe(exiftool);
    });
    it("should read from filename", done => {
        const exiftool = index_1.exec("-fast", path_1.join(FIXTURE_DIR, "placeholder.png"));
        exiftool.on("exif", exif => {
            expect(exif.length).toEqual(1);
            expect(exif[0].FileType).toEqual("PNG");
            return done();
        });
    });
    it("should support short output", done => {
        const exiftool = index_1.exec("-S", path_1.join(FIXTURE_DIR, "placeholder.png"));
        exiftool.on("exif", exif => {
            expect(exif.length).toEqual(1);
            expect(exif[0].FileType).toEqual("PNG");
            return done();
        });
    });
    it("should group output", done => {
        const exiftool = index_1.exec("-g", path_1.join(FIXTURE_DIR, "placeholder.png"));
        exiftool.on("exif", exif => {
            expect(exif.length).toEqual(1);
            expect(exif[0].File.FileType).toEqual("PNG");
            return done();
        });
    });
    it("should emit errors", done => {
        const exiftool = index_1.exec("this_file_does_not_exist.png");
        exiftool.on("error", error => {
            expect(error.message).toEqual("Error: File not found - this_file_does_not_exist.png");
            return done();
        });
    });
    it("should parse multiple exif data", done => {
        const exiftool = index_1.exec("-common", FIXTURE_DIR);
        exiftool.on("exif", (exif) => {
            expect(exif.map(x => x.FileName).sort()).toEqual([
                "placeholder.png",
                "subway.jpeg"
            ]);
            return done();
        });
    });
    it("should stay open", () => {
        const exiftool = index_1.open();
        const data = Promise.all([
            exiftool.send(path_1.join(FIXTURE_DIR, "placeholder.png")),
            exiftool.send(path_1.join(FIXTURE_DIR, "subway.jpeg")),
            exiftool.send(path_1.join(FIXTURE_DIR, "placeholder.png"))
        ]);
        exiftool.close();
        return data.then(exifs => {
            expect(exifs.length).toEqual(3);
            expect(exifs[0][0].FileType).toEqual("PNG");
            expect(exifs[1][0].FileType).toEqual("JPEG");
            expect(exifs[2][0].FileType).toEqual("PNG");
        });
    });
    it("should stream multiple files", () => {
        const exiftool = index_1.open();
        const data = Promise.all([
            exiftool.read(fs_1.createReadStream(path_1.join(FIXTURE_DIR, "placeholder.png"))),
            exiftool.read(fs_1.createReadStream(path_1.join(FIXTURE_DIR, "subway.jpeg"))),
            exiftool.read(fs_1.createReadStream(path_1.join(FIXTURE_DIR, "placeholder.png")))
        ]);
        exiftool.close();
        return data.then(exifs => {
            expect(exifs.length).toEqual(3);
            expect(exifs[0][0].FileType).toEqual("PNG");
            expect(exifs[1][0].FileType).toEqual("JPEG");
            expect(exifs[2][0].FileType).toEqual("PNG");
        });
    });
});
//# sourceMappingURL=index.spec.js.map