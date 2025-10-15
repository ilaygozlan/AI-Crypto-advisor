#!/usr/bin/env node

/**
 * Schema validation script for JSON Schemas and OpenAPI specification
 * Validates all schema files and ensures they are properly formatted
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    JSON.parse(content)
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

function validateJSONSchema(schemaPath) {
  const result = validateJSON(schemaPath)
  if (!result.valid) {
    log(`❌ Invalid JSON Schema: ${path.relative(projectRoot, schemaPath)}`, 'red')
    log(`   Error: ${result.error}`, 'red')
    return false
  }

  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
    
    // Basic schema validation
    if (!schema.$schema) {
      log(`⚠️  Missing $schema in: ${path.relative(projectRoot, schemaPath)}`, 'yellow')
    }
    
    if (!schema.title) {
      log(`⚠️  Missing title in: ${path.relative(projectRoot, schemaPath)}`, 'yellow')
    }
    
    if (!schema.type) {
      log(`⚠️  Missing type in: ${path.relative(projectRoot, schemaPath)}`, 'yellow')
    }
    
    if (!schema.examples || schema.examples.length === 0) {
      log(`⚠️  Missing examples in: ${path.relative(projectRoot, schemaPath)}`, 'yellow')
    }
    
    log(`✅ Valid JSON Schema: ${path.relative(projectRoot, schemaPath)}`, 'green')
    return true
  } catch (error) {
    log(`❌ Schema validation error: ${path.relative(projectRoot, schemaPath)}`, 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

function validateOpenAPI(openAPIPath) {
  const result = validateJSON(openAPIPath)
  if (!result.valid) {
    log(`❌ Invalid OpenAPI spec: ${path.relative(projectRoot, openAPIPath)}`, 'red')
    log(`   Error: ${result.error}`, 'red')
    return false
  }

  try {
    const spec = JSON.parse(fs.readFileSync(openAPIPath, 'utf8'))
    
    // Basic OpenAPI validation
    if (!spec.openapi) {
      log(`❌ Missing openapi version in: ${path.relative(projectRoot, openAPIPath)}`, 'red')
      return false
    }
    
    if (!spec.info) {
      log(`❌ Missing info section in: ${path.relative(projectRoot, openAPIPath)}`, 'red')
      return false
    }
    
    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      log(`❌ Missing or empty paths in: ${path.relative(projectRoot, openAPIPath)}`, 'red')
      return false
    }
    
    log(`✅ Valid OpenAPI spec: ${path.relative(projectRoot, openAPIPath)}`, 'green')
    return true
  } catch (error) {
    log(`❌ OpenAPI validation error: ${path.relative(projectRoot, openAPIPath)}`, 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

function validatePostmanCollection(collectionPath) {
  const result = validateJSON(collectionPath)
  if (!result.valid) {
    log(`❌ Invalid Postman collection: ${path.relative(projectRoot, collectionPath)}`, 'red')
    log(`   Error: ${result.error}`, 'red')
    return false
  }

  try {
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'))
    
    // Basic Postman collection validation
    if (!collection.info) {
      log(`❌ Missing info section in: ${path.relative(projectRoot, collectionPath)}`, 'red')
      return false
    }
    
    if (!collection.item || collection.item.length === 0) {
      log(`❌ Missing or empty items in: ${path.relative(projectRoot, collectionPath)}`, 'red')
      return false
    }
    
    log(`✅ Valid Postman collection: ${path.relative(projectRoot, collectionPath)}`, 'green')
    return true
  } catch (error) {
    log(`❌ Postman collection validation error: ${path.relative(projectRoot, collectionPath)}`, 'red')
    log(`   Error: ${error.message}`, 'red')
    return false
  }
}

function main() {
  log('🔍 Validating API schemas and specifications...', 'bold')
  log('', 'reset')
  
  let totalFiles = 0
  let validFiles = 0
  
  // Validate JSON Schemas
  const schemasDir = path.join(projectRoot, 'schemas')
  if (fs.existsSync(schemasDir)) {
    log('📋 Validating JSON Schemas...', 'blue')
    const schemaFiles = fs.readdirSync(schemasDir)
      .filter(file => file.endsWith('.schema.json'))
    
    for (const file of schemaFiles) {
      totalFiles++
      if (validateJSONSchema(path.join(schemasDir, file))) {
        validFiles++
      }
    }
    log('', 'reset')
  }
  
  // Validate OpenAPI spec
  const openAPIPath = path.join(projectRoot, 'openapi', 'openapi.json')
  if (fs.existsSync(openAPIPath)) {
    log('📖 Validating OpenAPI specification...', 'blue')
    totalFiles++
    if (validateOpenAPI(openAPIPath)) {
      validFiles++
    }
    log('', 'reset')
  }
  
  // Validate Postman collection
  const postmanPath = path.join(projectRoot, 'postman', 'Moveo-AI-Crypto-Advisor.postman_collection.json')
  if (fs.existsSync(postmanPath)) {
    log('📮 Validating Postman collection...', 'blue')
    totalFiles++
    if (validatePostmanCollection(postmanPath)) {
      validFiles++
    }
    log('', 'reset')
  }
  
  // Validate webhook examples
  const webhooksDir = path.join(projectRoot, 'webhooks', 'examples')
  if (fs.existsSync(webhooksDir)) {
    log('🔗 Validating webhook examples...', 'blue')
    const webhookFiles = fs.readdirSync(webhooksDir)
      .filter(file => file.endsWith('.json'))
    
    for (const file of webhookFiles) {
      totalFiles++
      const result = validateJSON(path.join(webhooksDir, file))
      if (result.valid) {
        validFiles++
        log(`✅ Valid webhook example: ${file}`, 'green')
      } else {
        log(`❌ Invalid webhook example: ${file}`, 'red')
        log(`   Error: ${result.error}`, 'red')
      }
    }
    log('', 'reset')
  }
  
  // Summary
  log('📊 Validation Summary:', 'bold')
  log(`   Total files: ${totalFiles}`, 'reset')
  log(`   Valid files: ${validFiles}`, 'green')
  log(`   Invalid files: ${totalFiles - validFiles}`, totalFiles - validFiles > 0 ? 'red' : 'green')
  
  if (validFiles === totalFiles) {
    log('', 'reset')
    log('🎉 All schemas and specifications are valid!', 'green')
    process.exit(0)
  } else {
    log('', 'reset')
    log('❌ Some files failed validation. Please fix the errors above.', 'red')
    process.exit(1)
  }
}

main()
