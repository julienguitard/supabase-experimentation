import type { Option } from "../../../packages/types/index.ts";

export function cleanNullUndefined(value:null|undefined):string{
  return ''
}
export function cleanBoolean(value: boolean):string{
  if (value) {
    return 'true'
  }
  else {
    return 'false'
  }
}
export function cleanNumber(value: number):string{
  return value.toString()
}

export function cleanString(value: string):string{
  return value
}

export function cleanArray(value: any[],clean:(any)=>string):string{
  return value.map(item => clean(item)).join('\n')
}

export function cleanObject(value: Record<string, any>,keys:string[],clean:(any)=>string):string{
  return Object.entries(value).filter(([key,value]) => keys.includes(key)).map(([key, value]) => `${clean(value)}`).join('\n')
}

export function cleanRecursively(value:any,keys:string[]):string{
  if(typeof value === 'boolean'){
    return cleanBoolean(value)
  }
  else if (!value){
    return cleanNullUndefined(value)
  }
  else if(typeof value === 'number'){
    return cleanNumber(value)
  }
  else if(typeof value === 'string'){
    return cleanString(value)
  }
  else if(Array.isArray(value)){
    return cleanArray(value,(v)=>cleanRecursively(v,keys))
  }
  else if(typeof value === 'object'){
    return cleanObject(value,keys,(v)=>cleanRecursively(v,keys))
  }
}

