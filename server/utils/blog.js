// str is the body of blog
// length is total length we want for to create excerpt
// delim is an empty space
// apendix are dots ... which we are going to add in the end of excerpt

exports.smartTrim = (str, length, delim, appendix) => {
  if (str.length <= length) return str;
  let trimmedstr = str.substr(0, length + delim.length);

  //lastIndexOf give us the index value from backwards
  let lastDelimIndex = trimmedstr.lastIndexOf(delim);

  //  if in the end we have an empty space then we trimmed the string from 0 untill last space we found
  if (lastDelimIndex >= 0) {
    trimmedstr = trimmedstr.substr(0, lastDelimIndex);
  }
  // then we are going to add three dots in the end of trimmed string
  if (trimmedstr) trimmedstr += appendix;

  let cleanText = trimmedstr.replace(/<\/?[^>]+(>|$)/g, "");

  return cleanText;
};
