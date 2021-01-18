(ns cuberoom.core
  (:require [cuberoom.js :refer [js-console]]
            [mount.core :refer [defstate] :as mount]
            [cuberoom.phaser.example.core :as example]))

(defstate game
  :start (do
           (println "Creates a game object.")
           (js/Phaser.Game. example/phaser-config))
  :stop (do
          (println "Remove game object")
          (.destroy @game true false)))

(defn mount-components []
  (let [content (js/document.getElementById "app")]
    (while (.hasChildNodes content)
      (.removeChild content (.-lastChild content)))
    (.appendChild content (js/document.createTextNode "Welcome to cuberoom"))
    (mount/in-cljc-mode)
    (mount/start)
    (js-console "Flagwheel loaded core.js")
    (js-console @game)))

(defn init! []
  (mount-components))
