import { observable } from 'mobx'

export default class DataStore {
  @observable formData = null
  @observable message = null
}
