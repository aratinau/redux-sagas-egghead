import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from '../reducers'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)


// run est la glue entre le store et la fonction générique mySaga
sagaMiddleware.run(mySaga)
