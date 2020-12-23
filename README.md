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

# Itérateurs et générateurs

## Itérateurs

Un itérateur est un objet sachant comment accéder aux éléments d'une collection un par un et qui connait leur position dans la collection. En JavaScript, un itérateur expose une méthode next() qui retourne l'élément suivant dans la séquence. Cette méthode renvoie un objet possédant deux propriétés : done et value.

## Itérables

Un objet est considéré comme itérable s'il définit le comportement qu'il aura lors de l'itération (par exemple les valeurs qui seront utilisées dans une boucle for...of). Certains types natifs, tels qu'Array ou Map, possède un comportement par défaut pour les itérations, cependant d'autres types comme les Objets, ne possèdent pas ce comportement.

## Générateurs

Les itérateurs personnalisés sont un outil utile mais leur création peut s'avérer complexe et il faut maintenir leur état interne. Avec les générateurs, on peut définir une seule fonction qui est un algorithme itératif et qui peut maintenir son état.

Un générateur est un type de fonction spécial qui fonctionne comme une fabrique (factory) d'itérateurs. Une fonction devient un générateur lorsqu'elle contient une ou plusieurs expressions yield et qu'elle utilise la syntaxe function*.

### function*

La déclaration function* permet de définir un générateur (un générateur est un objet Generator). Les générateurs sont des fonctions qu'il est possible de quitter puis de reprendre.

```js
function* generator(i) {
  yield i;
  yield i + 10;
}

const gen = generator(10);

console.log(gen.next().value);
// expected output: 10

console.log(gen.next().value);
// expected output: 20
```

L'objet Generator est renvoyé par une fonction génératrice, c'est à la fois un itérateur et un itérable.

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen(); // "Generator { }"
```

### yield

Le mot-clé yield est utilisé pour suspendre et reprendre une fonction génératrice (function* ou une fonction génératrice historique).

```js
function* foo(index) {
  while (index < 2) {
    yield index;
    index++;
  }
}

const iterator = foo(0);

console.log(iterator.next().value);
// expected output: 0

console.log(iterator.next().value);
// expected output: 1
```

Une expression yield* est utilisée afin de déléguer le mécanisme d'itération/génération à un autre générateur ou à un autre objet itérable.

```js
function* func1() {
  yield 42;
}

function* func2() {
  yield* func1();
}

const iterator = func2();

console.log(iterator.next().value);
// expected output: 42
