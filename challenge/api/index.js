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
        //console.log(langSortedJson)
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
    var finalRepoData = {
        "itemType":"application/vnd.lime.document-select+json",
        "items":[]
    }

    for (i = 0; i < data.length; i++) {
        var currentJson = 
            {"header": {"type":"application/vnd.lime.media-link+json",
                "value": {"title":data[i]['name'],
                "text":data[i]['description'],
                "type":"image/jpeg",
                "uri":data[i]['owner']['avatar_url']}
            }
            }
        finalRepoData["items"].push(currentJson)
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


server.get('/', async (request, response) => {
    const result = await getGithubApiAsync()
    
    response.status(result.status)
    response.send(result.data)
})

server.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, server.settings.env);
  });
