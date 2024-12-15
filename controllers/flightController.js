const fetchFlightOffers = async (requestSlices, age, limit) => {
  try {
    const response = await fetch(
      `https://api.duffel.com/air/offer_requests?limit=${limit}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
          "Content-Type": "application/json",
          "Duffel-Version": "v2",
        },
        body: JSON.stringify({
          data: {
            slices: requestSlices,
            passengers: [{ age }],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Duffel API Error: ${response.statusText}`);
    }

    const results = await response.json();
    return results.data.offers;
  } catch (error) {
    throw new Error(`Failed to fetch flight offers: ${error.message}`);
  }
};

const validateSlices = (slices) => {
  if (!slices || !Array.isArray(slices) || slices.length === 0) {
    throw new Error("Invalid or missing slices array.");
  }
};

const mapSlices = (slices) => {
  return slices.map((slice) => ({
    origin: slice.origin,
    destination: slice.destination,
    departure_date: slice.departure_date,
  }));
};

const flightOffers = async (req, res, next) => {
  const { slices, age } = req.body;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Validate slices and prepare data
  try {
    validateSlices(slices);
    const requestSlices = mapSlices(slices);

    // Fetch flight offers
    const offers = await fetchFlightOffers(requestSlices, age, limit);

    // Send response with limited offers
    res.status(200).json(offers.slice(0, limit));
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Invalid or missing slices array")) {
      return res.status(400).json({ error: error.message });
    }
    next(error); // Forward other errors to the error-handling middleware
  }
};

export { flightOffers };
