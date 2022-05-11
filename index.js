const express = require('express')
const fetch = require('node-fetch')

const server = express()

const getGithubApiAsync = async () => {
    const url = 'https://api.github.com/orgs/takenet/repos?per_page=100'

    try {
        const response = await fetch(url)
        const json = await response.json()
        const newJson = json2array(json)
        //console.log(newJson[3]['created_at']);
        const langSortedJson = await sortFunction(newJson)
        console.log(langSortedJson)
        const finalRepoData = await generateRepoData(langSortedJson)
        //const finalJson = JSON.parse(langSortedJson)
        return {
            status: response.status,
            data: finalRepoData,
        }
    } catch (error) {
        return {
            status: 500,
            data: { message: error.message },
        }
    }
}

const sortFunction = async (data) => {
    var repositorie = []
    for (i = 0; i < data.length; i++) {
        if (data[i]['language'] = 'C#') {
            repositorie.push(data[i])
        }
        if (repositorie.length == 5) {
            break;
        }
      }
    return repositorie;
}

const generateRepoData = async (data) => {
    var finalRepoData = []
    for (i = 0; i < data.length; i++) {
        var currentJson = 
            {
              "avatar_url": data[i]['owner']['avatar_url'],
              "name": data[i]['name'],
              "description": data[i]['description']
            }
        finalRepoData.push(currentJson)
    }
    return finalRepoData;
}

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
}


server.get('/challenge', async (request, response) => {
    const result = await getGithubApiAsync()
    
    response.status(result.status)
    response.send(result.data)
})

server.listen(8005, () => { console.log('Server initialized!') })