from split_words import Splitter


def split_search_term(search: str) -> str:
    """
    Splits compound words into tokens, i.e.: "Rinderfond" -> "Rinder fond"
    """
    splitter = Splitter()
    splits = splitter.split_compound(search)
    if len(splits):
        # skip low score splits
        if splits[0][0] < 0.1:
            return search
        return " ".join(splits[0][1:])

    return search
