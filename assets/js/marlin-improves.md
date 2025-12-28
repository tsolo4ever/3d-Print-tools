Call locateTh3dPrinterBlock(lines) in parseConfigFile() before firstPass() and secondPass().


locateTh3dPrinterBlock(lines) {
  let start = -1, end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/TH3D Configuration/.test(lines[i])) { start = i; break; }
  }
  if (start !== -1) {
    for (let j = start + 1; j < lines.length; j++) {
      if (/^\/\/=+/.test(lines[j]) && /END PRINTER SECTION/i.test(lines[j])) { end = j; break; }
      if (/^\/\/=+/.test(lines[j]) && /PRINTERS|CONFIGURATION/i.test(lines[j])) { end = j; break; }
    }
  }
  if (start !== -1 && end === -1) end = lines.length;
  this.th3dPrinterBlock = (start !== -1 && end !== -1) ? { start, end } : null;
}
isInTh3dPrinterBlock(i) {
  const b = this.th3dPrinterBlock;
  return !!(b && i >= b.start && i < b.end);
}

Inside secondPass, when applying a field with scope: "th3dPrinterBlock", skip if outside:
if (fieldSpec.scope === 'th3dPrinterBlock' && !this.isInTh3dPrinterBlock(i)) continue;



transforms: {
  normalizePrinterId(value, fieldSpec, env, mapping) {
    const raw = String(value || '').trim();
    const alias = mapping?.aliases?.printerIds?.[raw];
    return alias ? alias : raw.toLowerCase();
  },
  normalizeMountId(value, fieldSpec, env, mapping) {
    const raw = String(value || '').trim();
    const alias = mapping?.aliases?.mountIds?.[raw];
    return alias ? alias : raw.toLowerCase();
  },
  normalizeAblType(value, fieldSpec) {
    const v = String(value || '').toUpperCase();
    if (v.includes('UBL')) return 'ubl';
    return 'bilinear';
  }
}

Ensure your extractValue() (or mapping application) calls transforms when fieldSpec.transform is present.

 Validation for mustBeOdd, min, max
In validateConfig():

for (const [category, fields] of Object.entries(this.fieldMapping)) {
  if (category.startsWith('$')) continue;
  for (const [fieldName, spec] of Object.entries(fields)) {
    const val = config[category]?.[fieldName];
    if (spec.required && val === undefined) {
      config.warnings.push({ level: 'error', message: `Missing required field: ${category}.${fieldName}` });
      continue;
    }
    const rules = spec.validation || {};
    if (val !== undefined) {
      if (typeof rules.min === 'number' && val < rules.min) {
        config.warnings.push({ level: 'warning', message: `${category}.${fieldName} below min ${rules.min}` });
      }
      if (typeof rules.max === 'number' && val > rules.max) {
        config.warnings.push({ level: 'warning', message: `${category}.${fieldName} above max ${rules.max}` });
      }
      if (rules.mustBeOdd && (parseInt(val, 10) % 2 === 0)) {
        config.warnings.push({ level: 'warning', message: `${category}.${fieldName} should be odd` });
      }
    }
  }
}


const bp = this.fieldMapping?.bedLevelingPolicy;
if (bp?.conflictRule?.value) {
  const ezabl = this.globalConditionals.has('ENDER5_PLUS_EZABL') || this.variables.ENDER5_PLUS_EZABL !== undefined;
  const noabl = this.globalConditionals.has('ENDER5_PLUS_NOABL') || this.variables.ENDER5_PLUS_NOABL !== undefined;
  if ((ezabl && noabl) || (!ezabl && !noabl)) {
    config.warnings.push({ level: 'error', message: bp.conflictRule.message });
  }
}
