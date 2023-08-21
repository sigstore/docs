import os
import frontmatter

def update_markdown_files(root_folder):
    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith('.md') or file.endswith('.markdown'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r') as f:
                    post = frontmatter.load(f)

                if 'position' in post.metadata:
                    post.metadata['weight'] = post.metadata.pop('position')

                    with open(file_path, 'w') as f:
                        f.write(frontmatter.dumps(post))

# Example usage
update_markdown_files('docs')
