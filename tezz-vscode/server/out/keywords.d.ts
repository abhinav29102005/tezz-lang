import { CompletionItemKind } from 'vscode-languageserver/node';
export interface KeywordDoc {
    label: string;
    kind: CompletionItemKind;
    data: number;
    detail: string;
    documentation: string;
}
export declare const tezzKeywords: KeywordDoc[];
