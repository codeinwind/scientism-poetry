
function detectLanguage(content) {
    let zhCount = 0, validCount = 0;
    const zhRanges = [
      [0x4E00, 0x9FFF],    
      [0x3400, 0x4DBF],    
      [0x20000, 0x2A6DF]   
    ];
  
    for (const char of content) {
      const code = char.codePointAt(0);
      
      if (/\s|\p{P}/u.test(char)) continue;
      
      validCount++;
  
      const isChinese = zhRanges.some(([start, end]) => code >= start && code <= end);
      if (isChinese) zhCount++;

      if (validCount >= 15) {
        if (zhCount >= 5) return 'zh';
        if (zhCount === 0) return 'en';
      }
    }
    
    return zhCount / validCount > 0.3 ? 'zh' : 'en';
  }
  
  module.exports = { detectLanguage };