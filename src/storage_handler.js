import {signal, effect} from '@preact/signals-react'

export function get_stored_signal(key_name){
  const temp = signal(JSON.parse(localStorage.getItem(key_name)));
  effect(() => {
    localStorage.setItem(key_name, JSON.stringify(temp.value));
  })
  return temp
}