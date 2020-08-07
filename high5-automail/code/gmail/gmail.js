//////////////////////////////////////////
/**
 * List of functions in this file:
 * generateOptionTags()
 * getDraftsInfo()
 * generateAliasesOptionTags()
 * getDraftContentById(draftId)
 */
//////////////////////////////////////////

/**
 * Generate <option> tags to be used in the
 * form. Invoked back-end.
 * 
 * <option> tags include gmail drafts id and name.
 * 
 * return optionTags
 * <option value="r-xxxxxx"> Template names </option>
 * <option value="r-xxxxxx"> Template names </option>
 * @returns optionTags
 */
function generateDraftsOptionTags() {
    var drafts = getDraftsInfo();
    var optionTags = "";
    drafts.forEach((draft) => {
        if (draft.subject.trim().length == 0) {
            draft.subject = "(no subject)";
        }
        optionTags +=
            `\n<option value="${draft.id}">
                ${draft.isStarred ? "★" : ""} 
                ${draft.subject} 
                - ${draft.size}
            </option>`
    });

    if (optionTags.length == 0) {
        optionTags = "<option value='NA'>No draft available!</option>";
    }

    return optionTags;
}

/**
 * Get drafts from Gmail
 * @returns arr
 * 
 * arr = [dr1, dr2, etc];
 * 
 * dr1 = {
 *  id: "r-xxxxx",
 *  subject: "Subject",
 *  isStarred: true|false,
 *  size: "xxKB"
 * }
 */
function getDraftsInfo() {
    return GmailApp.getDrafts().map(draft => {
        return {
            id: draft.getId(),
            subject: draft.getMessage().getSubject(),
            isStarred: draft.getMessage().isStarred(),
            size: (~~(Utilities
                .newBlob(draft.getMessage().getRawContent())
                .getBytes().length / 1024)) + "KB"
        };
    })
}

/**
 * Generate <option> tags to be used in the alias
 * field of the form
 * 
 * <option value="hhoang@high5hanoi.edu.vn">hhoang@abc....</option>
 * <option value="hhoang@high5hanoi.edu.vn">hhoang@abc....</option>
 */
function generateAliasesOptionTags() {
    var defaultAlias =
        `<option value=''>Not selected</option>
        <option disabled='disabled'>-----</option>`;
    var aliases = GmailApp.getAliases();
    if (aliases.length == 0) {
        return "<option value=''>No alias</option>";
    }

    return defaultAlias + aliases.map(alias => {
        return `<option value="${alias}">${alias}</option>`;
    });
}

/**
 * Get content of the draft specified with an ID
 * @param {String} draftId "r-xxxxxxxxxxxx"
 * @returns {String} draftBody 
 */
function getDraftContentById(draftId) {
    return GmailApp.getDraft(draftId).getMessage().getPlainBody();
}

