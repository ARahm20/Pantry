'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Grid, IconButton } from '@mui/material'
import { firestore } from '@/firebase'
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

// Styles for glassmorphism and dark mode
const glassStyle = {
  background: 'rgba(0, 0, 0, 0.5)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const modalStyle = {
  ...glassStyle,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  color: '#fff',
}

export default function StoreFront() {
  const [items, setItems] = useState([])
  const [cart, setCart] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  const updateItems = async () => {
    const snapshot = collection(firestore, 'items')
    const docs = await getDocs(snapshot)
    const itemsList = []
    docs.forEach((doc) => {
      itemsList.push({ id: doc.id, ...doc.data() })
    })
    setItems(itemsList)
  }

  useEffect(() => {
    updateItems()
  }, [])

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, '')
    setItemPrice(formatNumberWithCommas(value))
  }

  const addItem = async () => {
    const priceNumber = parseFloat(itemPrice.replace(/,/g, ''))
    if (isNaN(priceNumber)) return
    const docRef = doc(collection(firestore, 'items'), itemName)
    await setDoc(docRef, { name: itemName, price: priceNumber })
    await updateItems()
    setItemName('')
    setItemPrice('')
    handleClose()
  }

  const removeItem = async (itemId) => {
    const docRef = doc(collection(firestore, 'items'), itemId)
    await deleteDoc(docRef)
    await updateItems()
  }

  const addToCart = (item) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find(cartItem => cartItem.id === item.id)
      if (itemInCart) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(cartItem => cartItem.id !== itemId))
  }

  const changeQuantity = (itemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + delta }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0)
    )
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode) // Toggle dark mode

  const isMatch = (itemName) => {
    return searchQuery && itemName.toLowerCase().startsWith(searchQuery.toLowerCase())
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      padding={2}
      sx={{
        backgroundImage: 'url(/Dark.jpg)', // Set a background image
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
      }}
    >
      <IconButton onClick={toggleDarkMode} sx={{ alignSelf: 'flex-end' }}>
        {isDarkMode ? <Brightness7Icon sx={{ color: '#fff' }} /> : <Brightness4Icon sx={{ color: '#fff' }} />}
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
            Add Item
          </Typography>
          <TextField
            id="outlined-basic"
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: '#424242', color: '#fff' }}
            InputLabelProps={{ style: { color: '#ffffff' } }}
            InputProps={{
              style: { color: '#ffffff' }
            }}
          />
          <TextField
            id="outlined-basic"
            label="Item Price"
            variant="outlined"
            fullWidth
            value={itemPrice}
            onChange={handlePriceChange}
            sx={{ borderRadius: 2, bgcolor: '#424242', color: '#fff' }}
            InputLabelProps={{ style: { color: '#ffffff' } }}
            InputProps={{
              style: { color: '#ffffff' }
            }}
          />
          <Button
            variant="contained"
            onClick={addItem}
            sx={{
              borderRadius: 8,
              padding: '10px 20px',
              bgcolor: '#ff4081',
              color: '#fff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': { bgcolor: '#e040fb' },
              textTransform: 'none',
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      
      {/* Title above the search bar */}
      <Typography variant="h1" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 900, marginBottom: 2, color: '#df3d73', boxShadow: '0px 4px 8px rgba(1, 1, 0, 1)' }}>
        Ameens Black Market
      </Typography>

      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: 2,
          borderRadius: 8,
          bgcolor: 'rgba(0, 0, 0, 0.5)', // Glass-like background for input
          backdropFilter: 'blur(10px)',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
          '& .MuiInputBase-input': {
            color: '#ffffff', // Text color
          },
          '& .MuiInputLabel-root': {
            color: '#ffffff', // Label color
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          marginBottom: 2,
          borderRadius: 8,
          padding: '10px 20px',
          bgcolor: '#ff4081',
          color: '#fff',
          '&:hover': { bgcolor: '#e040fb' },
          textTransform: 'none',
        }}
      >
        Add New Item
      </Button>
      <Box width="800px" padding={3} borderRadius={4} sx={{ ...glassStyle, marginTop: 2 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 800 }}>
          Store Items
        </Typography>
        <Grid container spacing={.5}>
          {items.map(({ id, name, price }) => (
            <Grid item xs={12} md={4} key={id}>
              <Box
                width="100%"
                minHeight="150px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                padding={2}
                borderRadius={4}
                sx={{
                  ...glassStyle,
                  boxShadow: isMatch(name) ? '0 0 10px 2px #ff4081' : 'none',
                  border: isMatch(name) ? '2px solid #ff4081' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
                position="relative"
              >
                <Typography variant="h6" textAlign="center" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" textAlign="center" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  Price: ${formatPrice(price)}
                </Typography>
                <IconButton
                  onClick={() => removeItem(id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#fff',
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={() => addToCart({ id, name, price })}
                  sx={{
                    borderRadius: 8,
                    marginTop: 2,
                    bgcolor: '#ff4081',
                    color: '#fff',
                    '&:hover': { bgcolor: '#e040fb' },
                    textTransform: 'none',
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box width="800px" padding={3} borderRadius={4} sx={{ ...glassStyle, marginTop: 4 }}>
        <Typography variant="h4" textAlign="center" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 800 }}>
          Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="body1" textAlign="center" sx={{ fontFamily: 'Roboto, sans-serif' }}>
            Your cart is empty
          </Typography>
        ) : (
          cart.map(({ id, name, price, quantity }, index) => (
            <Box
              key={index}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingX={5}
              marginY={1}
              borderRadius={4}
              sx={{ ...glassStyle }}
            >
              <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                Price: ${formatPrice(price)} x {quantity}
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => changeQuantity(id, -1)}
                  disabled={quantity <= 1}
                  sx={{ borderRadius: '50%', color: '#fff' }}
                >
                  <RemoveCircleOutline />
                </IconButton>
                <Typography variant="body1" textAlign="center" px={2} sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  {quantity}
                </Typography>
                <IconButton onClick={() => changeQuantity(id, 1)} sx={{ borderRadius: '50%', color: '#fff' }}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => removeFromCart(id)} sx={{ borderRadius: '50%', color: '#fff' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
