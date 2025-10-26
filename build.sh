#!/bin/bash

# ============================================================================
# ReysilvaGen Extension - Build Script with Minification
# ============================================================================

# Colors
GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'
RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'

# Configuration
EXTENSION_NAME="reysilvaGen-ext"
VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
OUTPUT_DIR="dist"
BUILD_DIR="build"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

get_file_size() {
    [[ "$OSTYPE" == "darwin"* ]] && stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo 0
}

show_progress_bar() {
    local current=$1 total=$2 type=$3
    local percent=$((current * 100 / total))
    local filled=$((percent / 2))
    local empty=$((50 - filled))
    
    printf "\r${CYAN}[${NC}" >&2
    printf "${GREEN}%${filled}s${NC}" "" | tr ' ' '=' >&2
    printf "${YELLOW}>${NC}" >&2
    printf "%${empty}s" "" | tr ' ' '-' >&2
    printf "${CYAN}]${NC} ${CYAN}%3d%%${NC} ${YELLOW}(%d/%d)${NC} %s" "$percent" "$current" "$total" "$type" >&2
}

print_summary() {
    local type=$1 count=$2 success=$3 failed=$4 orig=$5 mini=$6
    echo -e "${GREEN}═══════════════════════════════════════════════${NC}" >&2
    echo -e "${GREEN}  $type Minification Summary${NC}" >&2
    echo -e "${GREEN}═══════════════════════════════════════════════${NC}" >&2
    echo -e "  Files processed: $count" >&2
    echo -e "  ${GREEN}✓${NC} Minified: $success" >&2
    [ $failed -gt 0 ] && echo -e "  ${RED}✗${NC} Failed: $failed" >&2
    if [ "$orig" -gt 0 ]; then
        local orig_kb=$((orig / 1024)) mini_kb=$((mini / 1024))
        local reduction=$((100 - (mini * 100 / orig)))
        echo -e "  Original: ${orig_kb} KB → Minified: ${mini_kb} KB" >&2
        echo -e "  ${CYAN}Total reduction: ${reduction}%${NC}" >&2
    fi
    echo -e "${GREEN}═══════════════════════════════════════════════${NC}\n" >&2
}

minify_js() {
    local minified=0 failed=0 original_size=0 minified_size=0
    
    mapfile -t FILES < <(find "$BUILD_DIR" -name "*.js" -type f)
    local count=${#FILES[@]}
    local current=0
    
    echo "" >&2
    for file in "${FILES[@]}"; do
        ((current++))
        local filename=$(basename "$file")
        local original=$(get_file_size "$file")
        original_size=$((original_size + original))
        
        show_progress_bar "$current" "$count" "JavaScript"
        printf " ${YELLOW}→${NC} Processing: ${filename}..." >&2
        
        local temp="${file}.tmp"
        if npx terser "$file" --compress passes=3,drop_console=false --mangle --format comments=false,beautify=false,indent_level=0 --output "$temp" 2>/dev/null; then
            mv "$temp" "$file"
            local new_size=$(get_file_size "$file")
            minified_size=$((minified_size + new_size))
            ((minified++))
        else
            rm -f "$temp"
            ((failed++))
            minified_size=$((minified_size + original))
        fi
    done
    
    echo -e "\n" >&2
    print_summary "JavaScript" "$count" "$minified" "$failed" "$original_size" "$minified_size"
    echo "$original_size $minified_size"
}

minify_html() {
    local minified=0 failed=0 original_size=0 minified_size=0
    
    mapfile -t FILES < <(find "$BUILD_DIR" -name "*.html" -type f)
    local count=${#FILES[@]}
    local current=0
    
    echo "" >&2
    for file in "${FILES[@]}"; do
        ((current++))
        local filename=$(basename "$file")
        local original=$(get_file_size "$file")
        original_size=$((original_size + original))
        
        show_progress_bar "$current" "$count" "HTML"
        printf " ${YELLOW}→${NC} Processing: ${filename}..." >&2
        
        local temp="${file}.tmp"
        if npx html-minifier-terser "$file" --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true --output "$temp" 2>/dev/null; then
            mv "$temp" "$file"
            local new_size=$(get_file_size "$file")
            minified_size=$((minified_size + new_size))
            ((minified++))
        else
            rm -f "$temp"
            ((failed++))
            minified_size=$((minified_size + original))
        fi
    done
    
    echo -e "\n" >&2
    print_summary "HTML" "$count" "$minified" "$failed" "$original_size" "$minified_size"
    echo "$original_size $minified_size"
}

# ============================================================================
# HEADER
# ============================================================================

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ReysilvaGen - Minified Build Script         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"
echo -e "${CYAN}Extension:${NC} ${EXTENSION_NAME}"
echo -e "${CYAN}Version:${NC}   ${VERSION}\n"

# Check dependencies
for tool in terser html-minifier-terser; do
    if ! npx $tool --version &> /dev/null; then
        echo -e "${YELLOW}Installing $tool...${NC}"
        npm install --save-dev $tool
    fi
done

# Setup directories
mkdir -p "$OUTPUT_DIR"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# ============================================================================
# STEP 1: COPY FILES
# ============================================================================

echo -e "${BLUE}📦 Step 1: Copying files...${NC}"

for file in manifest.json background.js popup.html popup.js options.html options.js styles.css icon.svg logo.svg README.md LICENSE LEGAL_DISCLAIMER.md; do
    [ -f "$file" ] && cp "$file" "$BUILD_DIR/"
done

for dir in shared js assets css; do
    [ -d "$dir" ] && cp -r "$dir" "$BUILD_DIR/"
done

echo -e "${GREEN}✓${NC} Files copied to build directory\n"

# ============================================================================
# STEP 2: MINIFY JAVASCRIPT
# ============================================================================

echo -e "${BLUE}🔧 Step 2: Minifying JavaScript files...${NC}\n"

JS_STATS=$(minify_js)

# ============================================================================
# STEP 3: MINIFY HTML
# ============================================================================

echo -e "${BLUE}🔧 Step 3: Minifying HTML files...${NC}\n"

HTML_STATS=$(minify_html)

# ============================================================================
# STEP 4: CREATE ZIP
# ============================================================================

echo -e "${BLUE}📦 Step 4: Creating ZIP package...${NC}"

ZIP_NAME="${EXTENSION_NAME}-${VERSION}-minified.zip"
cd "$BUILD_DIR" || exit 1
zip -r "../${OUTPUT_DIR}/${ZIP_NAME}" . -q
cd ..

if [ -f "${OUTPUT_DIR}/${ZIP_NAME}" ]; then
    FILE_SIZE=$(du -h "${OUTPUT_DIR}/${ZIP_NAME}" | cut -f1)
    echo -e "${GREEN}✓${NC} Created: ${ZIP_NAME} (${FILE_SIZE})\n"
else
    echo -e "${RED}✗${NC} Failed to create ZIP package"
    exit 1
fi

# ============================================================================
# STEP 5: CLEANUP
# ============================================================================

echo -e "${BLUE}🧹 Step 5: Cleaning up...${NC}"
rm -rf "$BUILD_DIR"
echo -e "${GREEN}✓${NC} Build directory cleaned\n"

# ============================================================================
# FINAL SUMMARY
# ============================================================================

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Build Complete! 🎉                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}\n"
echo -e "${CYAN}Package:${NC} ${OUTPUT_DIR}/${ZIP_NAME}"
echo -e "${CYAN}Size:${NC}    ${FILE_SIZE}\n"

# Calculate total reduction
read -r JS_ORIG JS_MINI <<< "$JS_STATS"
read -r HTML_ORIG HTML_MINI <<< "$HTML_STATS"
TOTAL_ORIGINAL=$((JS_ORIG + HTML_ORIG))
TOTAL_MINIFIED=$((JS_MINI + HTML_MINI))

if [ "$TOTAL_ORIGINAL" -gt 0 ]; then
    GRAND_TOTAL_REDUCTION=$((100 - (TOTAL_MINIFIED * 100 / TOTAL_ORIGINAL)))
    echo -e "${CYAN}Total Size Reduction:${NC} ${GRAND_TOTAL_REDUCTION}%\n"
fi

echo -e "${YELLOW}📝 Installation Instructions:${NC}"
echo -e "  1. Go to: ${CYAN}chrome://extensions/${NC}"
echo -e "  2. Enable ${CYAN}Developer Mode${NC}"
echo -e "  3. Extract ZIP and click ${CYAN}'Load unpacked'${NC}\n"
echo -e "${GREEN}✨ All JavaScript files minified!${NC}"
echo -e "${GREEN}✨ All HTML files minified!${NC}"
echo -e "${GREEN}✨ Comments & whitespace removed!${NC}\n"
