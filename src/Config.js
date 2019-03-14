// import GitlabProvider from './providers/Gitlab'
// import DemoProvider from './providers/Demo'
import JsonArrayStorage from './storages/JsonArray'
import RestStorage from './storages/Rest'
import TextType from './types/Text'
import RepeatType from './types/Repeat'
import SelectType from './types/Select'
import WysiwygType from './types/Wysiwyg/Wysiwyg'
import DateType from './types/Date'
import FileType from './types/File/File'
import LocationType from './types/Location'
import GroupType from './types/Group'
import RelationshipType from './types/Relationship'

const config = {
  providers: {},
  storages: {},
  types: {}
}

const ret = {}

// Provider handling functions
ret.registerProvider = (provider) => {
  config.providers[provider.getId()] = provider
}
ret.removeProvider = (id) => delete config.providers[id]
ret.getProvider = (id) => config.providers[id]
ret.getProviders = () => Object.keys(config.providers)

// Storage handling functions
ret.registerStorage = (storage) => {
  config.storages[storage.getId()] = storage
}
ret.getStorage = (id) => config.storages[id]

// Type handling functions
ret.registerType = (type) => {
  config.types[type.name] = type
}
ret.getType = (id) => config.types[id]

// Auto-register all internal providers and types
// ret.registerProvider(new GitlabProvider())
// ret.registerProvider(new DemoProvider())
ret.registerStorage(JsonArrayStorage)
ret.registerStorage(RestStorage)
ret.registerType(TextType)
ret.registerType(SelectType)
ret.registerType(WysiwygType)
ret.registerType(DateType)
ret.registerType(FileType)
ret.registerType(RepeatType)
ret.registerType(LocationType)
ret.registerType(GroupType)
ret.registerType(RelationshipType)

export default ret
