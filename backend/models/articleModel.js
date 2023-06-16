const conn = require('../db/db')

const Articles = {
    getAllArticle: (req, res) => {
        try{
            const query = "SELECT * FROM article"
            conn.execute(query, (err, results) => {
                if(err){
                    console.error(err)
                    res.status(500).json({
                        status: 'error',
                        error: true,
                        message: 'Internal Server Error'
                    })
                }

                // Combine article information with the image filename
                const formattedResults = results.map(article => {
                    return {
                        id: article.id,
                        title: article.title,
                        text: article.text,
                        image: `https://storage.googleapis.com/image-article-042/${article.image}`, // Assuming images are stored in the "public/images" directory
                        createdAt: article.createdAt,
                        updatedAt: article.updatedAt 
                    };
                });

                res.status(200).json({
                    status: 'success',
                    error: false,
                    message: 'Get All Article Successfully',
                    result: formattedResults
                })
            })
        }catch(e){
            console.log(e)
            res.status(500).json({
                status: "error",
                error: true,
                message: "internal Server Error"
            })
        }
    },

    getArticleById: (req, res) => {
        const id = req.params.id
        const query = "SELECT * FROM article where id = ?";
        conn.execute(query, [id], (err, results)=>{
            if(err){
                console.log(err)
                res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Bad Request or Wrong Id'
                })
            }
            const result = results[0]
            res.status(200).json({
                status: 'success',
                error: false,
                message: 'Article Found',
                result: {
                    id: result.id,
                    title: result.title,
                    text: result.text,
                    image: `https://storage.googleapis.com/image-article-042/${result.image}`,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt 
                }
            })
        })
    },

    searchArticles: (req, res)=>{
        try{
            const search = req.params.search
            const query = "SELECT * FROM article"
            conn.execute(query, (err, articles) => {
                if(err){
                    console.error(err)
                    res.status(500).json({
                        status: 'error',
                        error: true,
                        message: 'Internal Server Error'
                    })
                }

                // Combine article information with the image filename
                const formattedResults = articles.map(article => {
                    return {
                        id: article.id,
                        title: article.title,
                        text: article.text,
                        image: `https://storage.googleapis.com/image-article-042/${article.image}`, // Assuming images are stored in the "public/images" directory
                        createdAt: article.createdAt,
                        updatedAt: article.updatedAt 
                    };
                });

                const results = formattedResults.filter(article =>
                    article.title.toLowerCase().includes(search.toLowerCase())
                  );
                
                if(results.length === 1){
                    return res.status(200).json({
                        status: 'success',
                        error: false,
                        message: 'Show Article By Search',
                        data: {
                            id: results[0].id,
                            title: results[0].title,
                            text: results[0].text,
                            image: `https://storage.googleapis.com/image-article-042/${results[0].image}`, // Assuming images are stored in the "public/images" directory
                            createdAt: results[0].createdAt,
                            updatedAt: results[0].updatedAt 
                        }
                    })
                }
                res.status(200).json({
                    status: 'success',
                    error: false,
                    message: 'Show Article By Search',
                    data: formattedResults
                })
            })
        }catch(e){
            console.log(e)
            res.status(500).json({
                status: "error",
                error: true,
                message: "internal Server Error"
            })
        }
    }
}

module.exports = Articles