async function getConcerts() {
  const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=1TTB7boAiG9XKGSvPmWm6SWY62qChT8B&venueId=KovZ917AJ4f,KovZpZAEkkIA,KovZpa3Bbe,KovZpZAFFE1A,KovZpa8kCe,KovZpZAdIFaA,KovZpZAJt7FA,KovZpZAFFEEA,KovZpa3yBe&source=ticketmaster&locale=*&size=20&sort=date,name,asc&countryCode=CA&stateCode=ON&segmentName=Music&preferredCountry=%20ca&includeSpellcheck=yes`;
  const response = await fetch(url);
  const data = await response.json();
  return data._embedded.events.map((concert) => {
    return {
      name: concert.name,
      artist: concert._embedded.attractions[0].name,
      eventImg: concert.images[0].url,
      date: concert.dates.start.localDate,
      time: concert.dates.start.localTime,
      venue: concert._embedded.venues[0].name,
      sales: concert.url,
    };
  });
}

module.exports = {
  getConcerts,
};
