import { getISODateString } from "./dates"

export const MSG = {

	extractedListItems: (listName?: string) => `${getISODateString()} - ${listName ? `Extracted from ${listName}` : `Extracted List`}`

}