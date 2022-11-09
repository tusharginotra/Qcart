import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import {generateCartItemsFrom} from "./Cart"

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [found, setfound] = useState(false);
  const [ cartdata, setCart] = useState([]);
  const [debounceTimeout, setdebounceTimeout] = useState(0);

  const token = localStorage.getItem('token');
  //const [cartItems, setCartItems] = useState([]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */



  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      let res = await axios
        .get(`${config.endpoint}/products`)
        .then((response) => {
          setfound(true);
          setproducts(response.data);
          //console.log( products)
          setLoading(false);
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.message);
        });
    } catch (error) {
      enqueueSnackbar(error.message);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    // if( localStorage.getItem('username'))
    // {
    //    setCart(fetchCart(localStorage.getItem('token')));
    //     // console.log(cartdata );
    //   if( {cartdata} !== null && cartdata.length !== 0)
    //   { 
    //     setCartItems(generateCartItemsFrom(cartdata,products));
    //   }
      
    // }
    performAPICall();
    if( localStorage.getItem('username'))
    {
      //setCart(fetchCart(localStorage.getItem('token')));
      fetchCart(localStorage.getItem('token'));
      //console.log(cartdata);
    }
    

  },[]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    try {
      setLoading(true);
      let res = await axios
        .get(`${config.endpoint}/products/search?value=${text}`)
        .then((response) => {
          setproducts(response.data);
          setfound(true);
          setLoading(false);
        })
        .catch((error) => {
          setproducts([]);
          //enqueueSnackbar("inside inner catch")
          setLoading(false);
          setfound(false);
          //enqueueSnackbar(error.message);
        });
    } catch (error) {
      enqueueSnackbar("inside outer catch");
      //enqueueSnackbar(error.message);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    let timerId = setTimeout(() => performSearch(event.target.value), 500);
    setdebounceTimeout(timerId);
  };
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      let res = await axios
        .get(`${config.endpoint}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if(response && response.data)
              {
                //console.log(response.data);
                // setCart(response.data)
                 setCart(response.data);
              }
          
        });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for( let i=0;i<items.length;i++)
    {
      if( items[i].productId === productId)
      {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(token)
    {
      if(options)
      {
        if( isItemInCart(items,productId) === false)
        {
          // await axios
          // .post(`${config.endpoint}/cart`, 
          // {
          //   "productId" : productId,
          //   "qty" : qty
          // },
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`
          //   }
          // })
          // .then((response) => {
          //   if(response && response.data)
          //       {
          //         //console.log(response.data);
          //         setCart(response.data)
          //         // setCart(response.data);
          //       }
          //   })
          postCallForCartAPI(token,productId,qty);
        }
        else
        {
          enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"})
        }
      }
      else
      {
        postCallForCartAPI(token,productId,qty);
      }
    }
    else
    {
      enqueueSnackbar("Please login to add the products in Cart.",{variant:"error"});
    }
  };

  const postCallForCartAPI = async (token, productId, qty) => {
    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(res.data);
    } catch (err) {
      if (err.response) {
        console.error(err.response);
      } else {
        console.error(err);
      }
    }
  };

  const ProductView = () => {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
        </Grid>
        <br />
        <br />
        {!loading && found && (
          <Grid container spacing={2}>
            {products.map((product) => {
              return (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard product={product} handleAddToCart={()=>addToCart(localStorage.getItem('token'),cartdata,products,product._id,1,true)} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {!loading && !found && (
          <Box fullWidth>
            <SentimentDissatisfied />
            <p> No products found.</p>
          </Box>
        )}

        {loading && (
          <div>
            <CircularProgress />
            Loading Products...
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Header hasHiddenAuthButtons>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
          }}
        />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />

      {/* Search view for mobiles */}

      {!localStorage.getItem("username") && <ProductView />}

      {localStorage.getItem("username") && (
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} md={9}>
            <ProductView />
          </Grid>

          <Grid item xs={12} md={3} >
            <Cart products={products} items={cartdata} handleQuantity={addToCart} />
          </Grid>
        </Grid>
      )}
      <Footer />
    </div>
  );
};

export default Products;
