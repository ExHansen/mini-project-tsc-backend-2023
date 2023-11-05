import http from 'http';
import data from './data.js';

const requestListener = (req, res) => {
    const method = req['method'];
    const url = req.url.split('/')[1];
    const params = req.url.split('/')[2];
    
    res.setHeader('Content-Type', 'application/json');

    if(method == 'GET' && req.url == '/getBooks'){
        const responseJSON = {
            message:"Data berhasil didapatkan",
            data: data,
        };
            res.end(JSON.stringify(responseJSON));
    }

    if (method === 'POST' && req.url === '/addBook') {
        let requestBody = '';
        req.on('data', (data) => {
            requestBody += data;
            console.log(requestBody);
        });
    
        req.on('end', () => {
            try {
                requestBody = JSON.parse(requestBody);
                data.push(requestBody);
                const responseJSON = {
                    message: "Data berhasil diinputkan",
                    data: data,
                };
                res.end(JSON.stringify(responseJSON));
            } catch (error) {
                const responseJSON = {
                    message: "Gagal memproses data",
                };
                res.statusCode = 400; 
                res.end(JSON.stringify(responseJSON));
            }
        });
    }       

    if (method === 'PUT' && req.url.startsWith('/editBook/')) {
        const urlParts = req.url.split('/');
        const index = urlParts[2]; 
        const bookIndex = parseInt(index, 10); 
        let requestBody = '';

        req.on('data', (data) => {
            requestBody += data;
        });

        req.on('end', () => {
            try {
                requestBody = JSON.parse(requestBody);

                if (bookIndex < 0 || bookIndex >= libraryData.length) {
                    res.statusCode = 404;
                    return res.end(JSON.stringify({
                        message: 'Data tidak ditemukan',
                    }));
                } else {
                    libraryData[bookIndex] = {
                        title: requestBody.title,
                        author: requestBody.author,
                    };

                    res.statusCode = 200;
                    return res.end(JSON.stringify({
                        message: 'Data berhasil diperbaharui',
                    }));
                }
            } catch (error) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    message: 'Gagal memproses data',
                }));
            }
        });
    }

    if (method === 'DELETE' && req.url.startsWith('/deleteBook/')) {
        const index = req.url.split('/').pop(); 
        const bookIndex = parseInt(index, 10); 
    
        if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= libraryData.length) {
            res.statusCode = 404;
            return res.end(JSON.stringify({
                message: 'Data tidak ditemukan',
            }));
        } else {
            libraryData.splice(bookIndex, 1);
            res.statusCode = 200;
            return res.end(JSON.stringify({
                message: 'Data berhasil dihapus',
            }));
        }
    }        
};

const app = http.createServer(requestListener);

const port = 3000;

app.listen(port, () => {
    console.log(`Console running on port ${port}`);
})
