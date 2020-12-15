# Sagas

## takeEvery

	Crée une saga sur chaque action envoyée au magasin qui correspond au modèle.

In the following example, we create a basic task fetchUser. We use takeEvery to start a new fetchUser task on each dispatched USER_REQUESTED action:

```js
import { takeEvery } from `redux-saga/effects`

function* fetchUser(action) {
  ...
}

function* watchFetchUser() {
  yield takeEvery('USER_REQUESTED', fetchUser)
}
```

takeEvery permet de gérer des actions simultanées. Dans l'exemple ci-dessus, lorsqu'une action USER_REQUESTED est distribuée, une nouvelle tâche fetchUser est lancée même si un précédent fetchUser est toujours en attente (par exemple, l'utilisateur clique sur un bouton Charger l'utilisateur 2 fois de suite à un rythme rapide, le 2ème clic sera envoie une action USER_REQUESTED alors que fetchUser a déclenché sur la première ne s'est pas encore terminée)

takeEvery ne gère pas les réponses dans le désordre des tâches. Il n'y a aucune garantie que les tâches se termineront dans le même ordre qu'elles ont été commencées. Pour gérer les réponses dans le désordre, vous pouvez considérer takeLatest ci-dessous.

## takeLatest

Crée une saga sur chaque action envoyée au magasin qui correspond au modèle. Et annule automatiquement toute tâche de saga précédente commencée précédemment si elle est toujours en cours d'exécution.

In the following example, we create a basic task fetchUser. We use takeLatest to start a new fetchUser task on each dispatched USER_REQUESTED action. Since takeLatest cancels any pending task started previously, we ensure that if a user triggers multiple consecutive USER_REQUESTED actions rapidly, we'll only conclude with the latest action

```js
import { takeLatest } from `redux-saga/effects`

function* fetchUser(action) {
  ...
}

function* watchLastFetchUser() {
  yield takeLatest('USER_REQUESTED', fetchUser)
}
```


## all

indique au middleware d'exécuter plusieurs effets en parallèle et d'attendre qu'ils se terminent tous. C'est tout à fait l'API correspondant à la norme Promise # all.

The following example runs two blocking calls in parallel:

```js
import { fetchCustomers, fetchProducts } from './path/to/api'
import { all, call } from `redux-saga/effects`

function* mySaga() {
  const [customers, products] = yield all([
    call(fetchCustomers),
    call(fetchProducts)
  ])
}
````

## call

demande au middleware d'appeler la fonction fn avec args comme arguments

## fork

demande au middleware d'effectuer un appel non bloquant sur fn

fork, comme call, peut être utilisé pour appeler les fonctions normales et Generator. Mais, les appels ne sont pas bloquants, le middleware ne suspend pas le générateur en attendant le résultat de fn. Au lieu de cela, dès que fn est appelé, le générateur reprend immédiatement.

## put

demande au middleware de planifier l'envoi d'une action au magasin. Cette répartition peut ne pas être immédiate car d'autres tâches peuvent se trouver en avance dans la file d'attente des tâches de la saga ou être toujours en cours.
