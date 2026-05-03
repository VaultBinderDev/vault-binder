exports.handler = async function(event) {
    const query = event.queryStringParameters.query;
    
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${query}`,
        {
            headers: {
                "X-Api-Key": process.env.POKEMON_TCG_API_KEY
            }
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};