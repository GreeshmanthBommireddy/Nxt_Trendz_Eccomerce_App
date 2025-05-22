import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => {
      const {cartList} = prevState

      const updatedCar = cartList.map(item => {
        if (item.id === id) {
          return {...item, quantity: item.quantity + 1}
        }
        return item
      })

      return {cartList: updatedCar}
    })
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedCart = prevState.cartList
        .map(item => {
          if (item.id === id) {
            if (item.quantity > 1) {
              return {...item, quantity: item.quantity - 1}
            }
            return null
          }
          return item
        })
        .filter(item => item !== null)
      return {cartList: updatedCart}
    })
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = product => {
    this.setState(prevState => {
      const {cartList} = prevState

      const findItem = cartList.find(each => each.id === product.id)

      if (findItem) {
        const updatedCart = cartList.map(item => {
          if (item.id === product.id) {
            return {...item, quantity: item.quantity + product.quantity}
          }

          return item
        })

        return {
          cartList: updatedCart,
        }
      }
      return {
        cartList: [...prevState.cartList, product],
      }
    })
  }

  removeCartItem = id => {
    this.setState(prevState => {
      const item = prevState.cartList.filter(each => each.id !== id)
      return {cartList: item}
    })
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
