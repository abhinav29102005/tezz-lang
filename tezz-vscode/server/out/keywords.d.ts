import { CompletionItemKind } from 'vscode-languageserver/node';
export interface KeywordItem {
    label: string;
    kind: CompletionItemKind;
    data: number;
    detail: string;
    documentation: string;
}
export declare const tezzKeywords: KeywordItem[];
