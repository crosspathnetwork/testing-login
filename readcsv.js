import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export default (filename) => new Promise(( resolve, reject ) => {
    const records = []
    fs.createReadStream( filename ).pipe( csv() ).on('data', (record) => {
          records.push(record);
    }).on('end', () => {
        resolve(records);
    });
});