# image-sorter

## install

1. `git clone`
2. `cd image-sorter`
3. `npm install`
4. Download exif from the web
5. Add path to exif executable in config.json

## usage
`node index.js --input /path/to/images/ --output /path/to/output/root`

The script parses de output of exif for all Images found flat in the input-folder.
They will be moved into folders by their creation date.

Imaged created on 2020-07-08 will be sorted in to `/path/to/output/2020/07/08/`


