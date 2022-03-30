export default function getElementConditionaly(element) {
  if (typeof window === 'object') {
    return document.querySelector(element)
  }

  return null
}